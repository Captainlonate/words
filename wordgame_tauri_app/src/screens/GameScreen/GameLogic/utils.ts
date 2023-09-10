import {
  assocPath,
  clone,
  concat,
  has,
  hasPath,
  identity,
  ifElse,
  keys,
  map,
  pathOr,
  pipe,
  replace,
  uniq,
} from 'ramda'
import { IDirection, IGameLogicState, IValidWordMap } from './gameLogicReducer'

export interface IUsedWordsMapParsedJSON {
  [key: string]: {
    r: number
    c: number
    d: IDirection
  }
}

/**
 * Parse the generated board JSON into this type.
 * This type represents the type stored as JSON, it's
 * not necessarily a type used by the application.
 */
export interface IGeneratedBoardParsedJSON {
  grid: string
  used: IUsedWordsMapParsedJSON
  /**
   * All of the words that can be built via the letters
   */
  all: string
  /**
   * The letters that were used to generate the board.
   * The same letters that will be shown in the Letters
   * wheel for the player to use to solve the board.
   * Note: This still needs to be jumbled up to prevent
   * showing an obvious 7-letter word.
   */
  letters: string
}

/**
 * Example
 * Input: "#ABC_D#EF_G##J"
 * Return: "#----#---##-"
 */
export const createNewPlayerBoardString: (str: string) => string = pipe(
  replace(/_/g, ''),
  replace(/[^#]/g, '-')
)

export const shuffleArray = <T>(arr: T[] = []): T[] => {
  const clonedArr = [...arr]
  let temp = clonedArr[0]
  let swapIdx = 0
  for (let idx = clonedArr.length - 1; idx > 0; idx--) {
    swapIdx = Math.floor(Math.random() * (idx + 1))
    temp = clonedArr[idx]
    clonedArr[idx] = clonedArr[swapIdx]
    clonedArr[swapIdx] = temp
  }

  return clonedArr
}

export const setWordDiscovered = (
  word: string,
  allWords: IValidWordMap
): IValidWordMap => {
  const clonedAllWords = clone(allWords)
  if (word in allWords) {
    allWords[word].hasPlayerFound = true
  }
  return clonedAllWords
}

export const buildPlayersGrid = (
  currentGrid: string,
  rowSize: number,
  allWords: IValidWordMap
): string => {
  const gridArray = currentGrid.split('')

  for (const word in allWords) {
    if (allWords[word].isUsedOnBoard && allWords[word].hasPlayerFound) {
      // For each letter, place it on the board
      for (let letterIdx = 0; letterIdx < word.split('').length; letterIdx++) {
        if (allWords[word].direction === 'H') {
          const cellIdx =
            allWords[word].row * rowSize + (allWords[word].col + letterIdx)
          gridArray[cellIdx] = word[letterIdx]
        } else {
          const cellIdx =
            (allWords[word].row + letterIdx) * rowSize + allWords[word].col
          gridArray[cellIdx] = word[letterIdx]
        }
      }
    }
  }

  return gridArray.join('').toUpperCase()
}

export const parseJSONBoardIntoNewState = (
  board: IGeneratedBoardParsedJSON
): IGameLogicState => {
  const solvedGrid = board.grid.replaceAll('_', '').toUpperCase()
  const playersGrid = createNewPlayerBoardString(board.grid)
  const gridRowSize = board.grid.split('_')[0].length

  // Create the word map
  const words: IValidWordMap = {}
  const allWords = uniq(board.all.split('_').concat(Object.keys(board.used)))
  for (const word of allWords) {
    words[word.toUpperCase()] = {
      row: pathOr(0, [word, 'r'], board.used),
      col: pathOr(0, [word, 'c'], board.used),
      direction: pathOr('H', [word, 'd'], board.used),
      isUsedOnBoard: has(word, board.used),
      hasPlayerFound: false,
    }
  }

  const letters = shuffleArray(board.letters.split('')).join('').toUpperCase()

  const newState: IGameLogicState = {
    solvedGrid,
    playersGrid,
    gridRowSize,
    words,
    letters,
  }

  return newState
}
