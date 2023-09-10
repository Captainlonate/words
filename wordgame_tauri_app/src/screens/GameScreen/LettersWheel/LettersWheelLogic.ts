import { LETTERS_WHEEL_CONFIG } from './LettersWheelConfig'
import { lettersStore } from '../../../rx/observables/letters'

/**
 * Each of the letters on the wheel will be placed
 * at a computed location (the perimeter of a circle).
 * For each of those anchor points on the circle,
 * one of these `ILetterLocation` will be created
 * to represent that location.
 */
interface ILetterLocation {
  /**
   * The center x and y coordinates where the letter should
   * be anchored. It's not just for positioning the letter though,
   * it's used as the anchor point for the line that connects
   * each active letter, as well as the center of the collision area.
   */
  centerX: number
  centerY: number
  /**
   * The actual letter that is placed in this location
   */
  letter: string
  /**
   * Used to determine if a mouse event occurred
   * "close enough" to the letter. This is like the
   * "touchable opacity" of each letter.
   */
  letterCollisionArea: {
    left: number
    right: number
    top: number
    bottom: number
  }
  /**
   *
   */
  positionIndex: number
}

/**
 * This structure is used to keep track of user actions.
 * For instance, `isDown` will be a flag used to remember
 * if the mouse/finger is pressed down. Really, this is a
 * collection of fields needed to implement the part of code
 * where a user is moving their mouse around and building a
 * word out of letters.
 */
interface IActionManager {
  /**
   * Is the user's mouse/finger held down (you build words
   * by holding down the mouse button and dragging it over
   * the letters)
   */
  isDown: boolean
  /**
   * Keeps track of the exact order of letters the user has
   * added to their word-in-progress.
   */
  path: ILetterLocation[]
  /**
   * Sets have really fast lookup times, so I use this set
   * to quickly check if a letter has already been activated
   * when the user moves their mouse over the letter.
   */
  activeLetters: Set<number>
  /**
   * Keeps track of the user's mouse coordinates within the
   * canvas element. This is used to draw the line from the
   * last letter to the mouse pointer (from the last element
   * in `path`, to the user's mouse)
   */
  mouseX: number
  mouseY: number
}

interface ILettersWheelStyles {
  /**
   * A string like "bold 12px serif" which defines the
   * font style for each of the letters. It scales based
   * on the width of the canvas.
   */
  font: string
  /**
   * The width of the lines that connect each active
   * letter. It scales based on the width of the canvas.
   */
  lineWidth: number
}

/**
 * (Lets me visualize all the fields and methods on the class concisely)
 */
interface LettersWheelLogicInterface {
  // Fields
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  letters: string[]
  letterLocations: ILetterLocation[]
  canvasWidth: number
  canvasHeight: number
  canvasCenterX: number
  canvasCenterY: number
  radius: number
  collisionRadius: number
  onCompleteWord: null | ((newWord: string) => void)
  styles: ILettersWheelStyles
  touch: IActionManager

  // Methods
  setOnCompleteCallback(fn: (newWord: string) => void): void
  setLettersPool(letters: string[]): void
  resize(): void
  render(): void
  getLetterLocationAtCoords(x: number, y: number): ILetterLocation | null
  clearTouchResetWordProgress(): void
  mouseDown(e: MouseEvent): void
  mouseUp(): void
  mouseMove(e: MouseEvent): void
  manuallyAddLetterToPath(letter: string): void
  updateInProgressWordGlobally(): void
  submitInProgressWordAsCompleted(): void
  deleteLastLetterInPath(): void
  addLetterLocationToPath(newLetterLocation: ILetterLocation): void
}

/**
 * This class will be used to manage the logic for the Letters Wheel,
 * as well as drawing it's current state to the canvas, and resizing
 * the canvas based on the containing dom element's size.
 */
export class LettersWheelLogic implements LettersWheelLogicInterface {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  /**
   * The pool of letters that should be displayed on the wheel
   */
  letters: string[] = []
  /**
   * An array of objects, where each object represents a location
   * for exactly one of the letters. The locations are calculated
   * based on how many letters there are.
   */
  letterLocations: ILetterLocation[] = []
  /**
   * The dimensions of the canvas DOM element
   */
  canvasWidth: number = 0
  canvasHeight: number = 0
  /**
   * The center coordinates of the canvas
   */
  canvasCenterX: number = 0
  canvasCenterY: number = 0
  /**
   * Determines how far from the center of the canvas that
   * the letters should be positioned. Note that this is not
   * the same thing that determines how big the background
   * circle is. That actually needs to be larger than this radius.
   */
  radius: number = 0
  /**
   * How large the collision area should be around each letter.
   * When a letter is active, a highlighted circle is drawn, whose
   * size is based on this collisionRadius. This also determines
   * how close to the letter the user's mouse must be in order to
   * select it.
   */
  collisionRadius: number = 0
  /**
   * The callback used when the user lifts up on their mouse and
   * "locks in" a new word
   */
  onCompleteWord: null | ((newWord: string) => void) = null
  // onSetInProgressWord: null | ((newInProgressWord: string) => void) = null
  styles: ILettersWheelStyles = {
    font: 'bold 12px serif',
    lineWidth: 5,
  }
  /**
   * Manages the state of the user's current word-in-progress.
   * As they link together letters, this object will keep
   * track of the order of the letters, and their mouse position.
   * The fields are described in the interface.
   */
  touch: IActionManager = {
    isDown: false,
    path: [],
    activeLetters: new Set(),
    mouseX: 0,
    mouseY: 0,
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    this.setLettersPool([])
    this.resize()
    this.clearTouchResetWordProgress()
  }

  setOnCompleteCallback = (fn: (newWord: string) => void) => {
    this.onCompleteWord = fn
  }

  /**
   * Assign a new pool of letters for the Letters Wheel to display.
   * Because the number of letters might change, the location of
   * all the letters needs to be recalculated. Therefor, `resize()`
   * will be called again.
   */
  setLettersPool = (letters: string[]) => {
    this.letters = [...letters]
    this.letterLocations = []
    this.resize()
  }

  /**
   * Call this whenever the canvas needs to be resized. In addition
   * to setting the width and height of the canvas, it will also calculate
   * all of the important coordinates and sizes of the components that
   * make up the Letters Wheel.
   *
   * Most of the parts of the Letters Wheel will scale based on the width
   * of the canvas (as a percentage of the width of the canvas).
   */
  resize = () => {
    const parentRect = this.canvas.parentElement?.getBoundingClientRect()
    if (parentRect) {
      //
      // Size and scale the canvas to make it look good on high DPI
      // displays. This will manually set the width and height of the
      // canvas based on the parent container element's dimensions.
      //

      this.canvasWidth = parentRect.width
      this.canvasHeight = parentRect.height
      this.canvas.width = this.canvasWidth * window.devicePixelRatio
      this.canvas.height = this.canvasHeight * window.devicePixelRatio
      this.canvas.style.width = this.canvasWidth + 'px'
      this.canvas.style.height = this.canvasHeight + 'px'
      this.ctx?.scale(window.devicePixelRatio, window.devicePixelRatio)

      //
      // Calculate any values that are dependent on the canvas size,
      // and that we wouldn't want to re-calculate on each render call
      //

      // Center coordinates of the canvas
      this.canvasCenterX = Math.floor(this.canvasWidth / 2)
      this.canvasCenterY = Math.floor(this.canvasHeight / 2)
      // Radius of the circle. Used to know how far from the
      // canvas center to place the letters.
      this.radius = Math.floor(this.canvasWidth / 2.5)
      // How big the clickable area should be around each letter
      this.collisionRadius = Math.floor(this.canvasWidth * 0.09)
      // The letters font style
      this.styles.font = `bold ${Math.floor(this.canvasWidth * 0.1)}px serif`
      // The width of the lines drawn between active letters
      this.styles.lineWidth = Math.floor(
        LETTERS_WHEEL_CONFIG.lineWidthPercentage * this.canvasWidth
      )

      // Calculate the letter positions
      this.letterLocations = []
      const numberOfLetters = this.letters.length
      for (let i = 0; i < numberOfLetters; i++) {
        const letterCenterX =
          this.canvasCenterX +
          this.radius * Math.cos((2 * Math.PI * i) / numberOfLetters)
        const letterCenterY =
          this.canvasCenterY +
          this.radius * Math.sin((2 * Math.PI * i) / numberOfLetters)
        let letterLocation: ILetterLocation = {
          centerX: letterCenterX,
          centerY: letterCenterY,
          letterCollisionArea: {
            left: letterCenterX - this.collisionRadius,
            right: letterCenterX + this.collisionRadius,
            top: letterCenterY - this.collisionRadius,
            bottom: letterCenterY + this.collisionRadius,
          },
          letter: this.letters[i],
          positionIndex: i,
        }
        this.letterLocations.push(letterLocation)
      }
    }
  }

  /**
   * Redraws the contents of the Letters Wheel to the canvas.
   *
   * This includes:
   *  - Clearing the canvas each frame
   *  - Drawing the background circle
   *  - Drawing the letters
   *  - Drawing a highlighted circle around each of the active letters
   *  - Drawing the lines between the active letters
   *  - Drawing the line from the last active letter, to your mouse pointer
   */
  render = () => {
    if (this.ctx) {
      // this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

      // Draw the circle
      this.ctx.fillStyle = LETTERS_WHEEL_CONFIG.circleBGColor
      this.ctx.beginPath()
      this.ctx.arc(
        this.canvasCenterX,
        this.canvasCenterY,
        Math.floor((this.canvasWidth / 2) * 0.98),
        0,
        2 * Math.PI
      )
      this.ctx.fill()
      this.ctx.closePath()

      // Highlight each of the active letters with a colored circle
      this.ctx.beginPath()
      this.ctx.fillStyle = LETTERS_WHEEL_CONFIG.letterHighlightColor
      for (const { centerX, centerY } of this.touch.path) {
        this.ctx.moveTo(centerX, centerY)
        this.ctx?.arc(centerX, centerY, this.collisionRadius, 0, 2 * Math.PI)
      }
      this.ctx.fill()
      this.ctx.closePath()

      // Draw the line segments
      this.ctx.lineWidth = this.styles.lineWidth
      this.ctx.strokeStyle = LETTERS_WHEEL_CONFIG.lineColor
      this.ctx.lineCap = 'round'
      this.ctx.beginPath()
      // 1) Draw the segments between the letters
      for (const segment of this.touch.path) {
        this.ctx.lineTo(segment.centerX, segment.centerY)
      }
      // 2) Draw the segment from the last letter to your mouse
      if (this.touch.isDown && this.touch.path.length > 0) {
        this.ctx.lineTo(this.touch.mouseX, this.touch.mouseY)
      }
      this.ctx.stroke()

      // Draw the letters
      this.ctx.fillStyle = LETTERS_WHEEL_CONFIG.letterFontColor
      this.ctx.font = this.styles.font
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      for (const { centerX, centerY, letter } of this.letterLocations) {
        this.ctx.fillText(letter, centerX, centerY)
      }
    }
  }

  /**
   * Given a set of coordinates (x and y), checks if if is over
   * any of the letters. If it is, that `ILetterLocation` will be returned.
   */
  getLetterLocationAtCoords = (
    x: number,
    y: number
  ): ILetterLocation | null => {
    for (const letterLocation of this.letterLocations) {
      if (
        x >= letterLocation.letterCollisionArea.left &&
        x <= letterLocation.letterCollisionArea.right &&
        y >= letterLocation.letterCollisionArea.top &&
        y <= letterLocation.letterCollisionArea.bottom
      ) {
        return letterLocation
      }
    }

    // It was not over any letters
    return null
  }

  /**
   * Reset the current word-in-progress and all of the state
   * that is managed while the user is dragging their mouse
   * around the Letters Wheel.
   */
  clearTouchResetWordProgress = () => {
    this.touch = {
      isDown: false,
      path: [],
      activeLetters: new Set(),
      mouseX: 0,
      mouseY: 0,
    }
    lettersStore.resetStore()
  }

  /**
   * When the user presses down on their mouse, previous
   * word-in-progress should be reset, and a new path should
   * be started.
   * Here, it's important to check if that very first mouse down
   * event happened to be over one of the letters. It's ok if it's
   * not, we'll pick it up when they drag the mouse around. But if
   * it is, we want to capture that letter as the first segment of
   * the path.
   */
  mouseDown = (e: MouseEvent) => {
    // Shouldn't need to clear it on mouseDown, because it should
    // be cleared on mouse up (but just to be safe)
    this.clearTouchResetWordProgress()

    // Start a new sequence of letters
    this.touch.isDown = true
    this.touch.mouseX = e.offsetX
    this.touch.mouseY = e.offsetY

    // Did this mouse down happen to start on top of a letter
    const touchedLetter = this.getLetterLocationAtCoords(e.offsetX, e.offsetY)
    if (touchedLetter) {
      this.touch.path.push(touchedLetter)
      this.touch.activeLetters.add(touchedLetter.positionIndex)
      this.updateInProgressWordGlobally()
    }

    this.render()
  }

  /**
   * When the user lifts up on their mouse, we want to reset
   * all progress on the word-in-progress and reset any state
   * that was managing the linked letters.
   * Afterward, we'll submit the event that a new series of letters
   * was created. The entire purpose of this Letters Wheel is right here,
   * to let the user link together some letters, and when they lift up
   * on the mouse, to send that string of letters to the callback.
   * It's like a glorified text input, and this method here is like
   * pressing the 'enter' key.
   */
  mouseUp = () => {
    this.submitInProgressWordAsCompleted()
    this.clearTouchResetWordProgress()
    this.render()
  }

  /**
   * This callback handles when the user has pressed down on their
   * mouse and is dragging it around the canvas. The goal is to check
   * if the the mouse location overlaps any of the letters on the wheel.
   * A couple things could happen here:
   * - They could be trying to add a new letter to the chain
   * - They could be trying to undo the last letter they added
   *
   * If the user has already linked a couple of letters, then they are
   * able to move their mouse onto the second-to-last letter, which will
   * remove the last-letter.
   *
   * So, if they've got:
   *  A -> B -> C
   * And they move their mouse over "B", then it will remove "C".
   * Then they'd have to mouse over "A", to remove "B".
   * And there is no way to remove the starting letter "A" (just mouse up).
   */
  mouseMove = (e: MouseEvent) => {
    if (this.touch.isDown) {
      // If they have dragged onto any letter, either active or inactive
      const touchedLetter = this.getLetterLocationAtCoords(e.offsetX, e.offsetY)
      if (touchedLetter) {
        // To remove the most recent "last" letter, you have to move your
        // mouse onto the the letter before the last one (2 letters ago).
        // This checks if their mouse is on the letter from 2 letters
        // ago (if there even are 2 letters).
        const isUserTryingToDeleteLastLetter =
          this.touch.path.length >= 2 &&
          touchedLetter.positionIndex ===
            this.touch.path[this.touch.path.length - 2].positionIndex
        if (isUserTryingToDeleteLastLetter) {
          this.deleteLastLetterInPath()
          this.updateInProgressWordGlobally()
        }
        // else if they moved their mouse onto a new & unused letter
        else if (!this.touch.activeLetters.has(touchedLetter.positionIndex)) {
          this.addLetterLocationToPath(touchedLetter)
          this.updateInProgressWordGlobally()
        }
      }

      // Update mouse position
      this.touch.mouseX = e.offsetX
      this.touch.mouseY = e.offsetY

      this.render()
    }
  }

  manuallyAddLetterToPath = (keyStroke: string) => {
    if (keyStroke.toUpperCase() === 'ENTER') {
      this.submitInProgressWordAsCompleted()
      this.clearTouchResetWordProgress()
    } else if (keyStroke.toUpperCase() === 'BACKSPACE') {
      this.deleteLastLetterInPath()
      this.updateInProgressWordGlobally()
    } else if (this.letters.includes(keyStroke)) {
      for (const letterLocation of this.letterLocations) {
        if (
          !this.touch.activeLetters.has(letterLocation.positionIndex) &&
          letterLocation.letter === keyStroke
        ) {
          this.addLetterLocationToPath(letterLocation)
          this.updateInProgressWordGlobally()
          break
        }
      }
    }

    this.render()
  }

  updateInProgressWordGlobally = () => {
    lettersStore.setLetters(this.touch.path.map((loc) => loc.letter).join(''))
  }

  submitInProgressWordAsCompleted = () => {
    const newWord = this.touch.path.map(({ letter }) => letter).join('')
    if (newWord) {
      if (typeof this.onCompleteWord === 'function' && newWord.length > 0) {
        this.onCompleteWord(newWord)
      }
    }
  }

  deleteLastLetterInPath = () => {
    if (this.touch.path?.length) {
      this.touch.activeLetters.delete(
        this.touch.path[this.touch.path.length - 1].positionIndex
      )
      this.touch.path.pop()
    }
  }

  addLetterLocationToPath = (newLetterLocation: ILetterLocation) => {
    if (!this.touch.activeLetters.has(newLetterLocation.positionIndex)) {
      this.touch.path.push(newLetterLocation)
      this.touch.activeLetters.add(newLetterLocation.positionIndex)
    }
  }
}
