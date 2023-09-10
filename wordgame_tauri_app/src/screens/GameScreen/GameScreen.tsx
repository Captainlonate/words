import * as Styled from './styles'

import { LettersWheel } from './LettersWheel/LettersWheel'
import { Board } from './Board/Board'
import { useCallback, useEffect, useReducer } from 'react'
import { gameLogicReducer, getDefaultState } from './GameLogic/gameLogicReducer'
import { parseJSONBoardIntoNewState } from './GameLogic/utils'
import { useLettersStore } from '../../rx/observables/letters'
import { fetchNewBoard } from './utils'

export const GameScreen = () => {
  const [gameState, dispatchGameState] = useReducer(
    gameLogicReducer,
    getDefaultState()
  )
  const lettersInProgress = useLettersStore()

  const onLockInWordAttempt = useCallback(
    (newWord: string) => {
      // Update the board
      const wordInfo = gameState.words[newWord]
      if (!!wordInfo && wordInfo?.hasPlayerFound === false) {
        dispatchGameState({ type: 'DISCOVERED_WORD', payload: newWord })
      }
      // TODO - Register word for user statistics
      // TODO - Submit word or board state via websockets
      // TODO - Store new game state persistently
    },
    [gameState.words, dispatchGameState]
  )

  /**
   * On first mount, load a new board
   */
  useEffect(() => {
    fetchNewBoard()
      .then((newBoard) => {
        dispatchGameState({
          type: 'SET_ENTIRE_STATE',
          payload: parseJSONBoardIntoNewState(newBoard),
        })
      })
      .catch(() => {
        console.log('Error: Could not load a new board.')
      })
  }, [])

  return (
    <Styled.GameScreenContainer>
      <Styled.BoardSection>
        <Board
          playersGrid={gameState.playersGrid}
          rowSize={gameState.gridRowSize}
        />
      </Styled.BoardSection>

      <Styled.ActiveWordSection>
        {!!lettersInProgress ? lettersInProgress : null}
      </Styled.ActiveWordSection>

      <Styled.WheelSection>
        <LettersWheel
          onCreateNewWord={onLockInWordAttempt}
          letters={gameState.letters}
        />
      </Styled.WheelSection>
    </Styled.GameScreenContainer>
  )
}
