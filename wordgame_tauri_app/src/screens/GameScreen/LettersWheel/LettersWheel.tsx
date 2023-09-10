import { useCallback, useEffect, useRef } from 'react'
import * as Styled from './styles'

import { LettersWheelLogic } from './LettersWheelLogic'

import { pipedKeyDownEvent$ } from '../../../rx/observables/keydown'
import { useObservable } from '../../../rx/useObservable'
import { pipedResizeEvent$ } from '../../../rx/observables/resize'

interface ILettersWheelProps {
  /**
   * Callback used when the user has built a new
   * string of letters and wants to lock it in.
   * So, if the user connects A -> B -> C, then
   * this callback would receive "ABC".
   */
  onCreateNewWord: (newWord: string) => void
  /**
   *
   */
  letters: string
}

export const LettersWheel = ({
  onCreateNewWord,
  letters,
}: ILettersWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logicRef = useRef<LettersWheelLogic | null>(null)

  const onKeyDown = useCallback(
    (keyboardKey: string) => {
      if (!!logicRef.current) {
        if (typeof keyboardKey === 'string') {
          logicRef.current.manuallyAddLetterToPath(keyboardKey.toUpperCase())
        }
      }
    },
    [logicRef.current]
  )

  const onResizeBrowser = useCallback(() => {
    if (!!logicRef.current) {
      logicRef.current.resize()
      logicRef.current.render()
    }
  }, [logicRef.current])

  useObservable(pipedKeyDownEvent$, onKeyDown)
  useObservable(pipedResizeEvent$, onResizeBrowser)

  /**
   * useEffect runs after render.
   *  So, it will have a canvasRef on the first run.
   *  It will create the logicRef on the first run.
   */
  useEffect(() => {
    const mouseDownHandler = (e: MouseEvent) => {
      if (!!logicRef.current) {
        logicRef.current.mouseDown(e)
      }
    }
    const mouseUpHandler = (e: MouseEvent) => {
      if (!!logicRef.current) {
        logicRef.current.mouseUp()
      }
    }
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!!logicRef.current) {
        logicRef.current.mouseMove(e)
      }
    }
    console.log('Attaching listeners')
    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousedown', mouseDownHandler)
      canvasRef.current.addEventListener('mouseup', mouseUpHandler)
      canvasRef.current.addEventListener('mousemove', mouseMoveHandler)
    }

    if (!!canvasRef.current && !logicRef.current) {
      logicRef.current = new LettersWheelLogic(canvasRef.current)
      logicRef.current.setOnCompleteCallback(onCreateNewWord)
      logicRef.current.render()
    }

    return () => {
      console.log('Removing listeners')

      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', mouseDownHandler)
        canvasRef.current.removeEventListener('mouseup', mouseUpHandler)
        canvasRef.current.removeEventListener('mousemove', mouseMoveHandler)
      }
    }
  }, [])

  /**
   * If the letters change, update the game logic
   */
  useEffect(() => {
    if (!!logicRef.current && !!letters) {
      logicRef.current.setLettersPool(letters.split(''))
      logicRef.current.render()
    }
  }, [logicRef.current, letters])

  /**
   * If the callbacks ever change, update the game logic
   */
  useEffect(() => {
    if (!!logicRef.current) {
      logicRef.current.setOnCompleteCallback(onCreateNewWord)
    }
  }, [logicRef.current, onCreateNewWord])

  return (
    <Styled.LettersCircleContainer>
      <Styled.LettersCircleCanvas ref={canvasRef} />
    </Styled.LettersCircleContainer>
  )
}
