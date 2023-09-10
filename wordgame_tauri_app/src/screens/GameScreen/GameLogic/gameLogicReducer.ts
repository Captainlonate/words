import { clone } from 'ramda'
import { buildPlayersGrid, setWordDiscovered } from './utils'

const ACTION_RESET_STATE = 'RESET_STATE' as const
const ACTION_SET_ENTIRE_STATE = 'SET_ENTIRE_STATE' as const
const ACTION_DISCOVERED_WORD = 'DISCOVERED_WORD' as const

export type IDirection = 'H' | 'V'

/**
 *
 */
export interface IValidWordMap {
  [key: string]: {
    row: number
    col: number
    direction: IDirection
    isUsedOnBoard: boolean
    hasPlayerFound: boolean
  }
}

/**
 * Represents a 2d grid, but it's stored in a 1d array.
 * You'd need to know the size of each row to be able
 * to "chunk" it into rows.
 */
export type IGrid1D = string[]

/**
 * The state stored within the reducer
 */
export interface IGameLogicState {
  words: IValidWordMap
  solvedGrid: string
  playersGrid: string
  gridRowSize: number
  letters: string
}

export const getDefaultState = (): IGameLogicState => ({
  words: {},
  solvedGrid: '',
  playersGrid: '',
  gridRowSize: 0,
  letters: '',
})

/**
 * All of the possible actions that can be dispatched
 * to the reducer, paired with their corresponding
 * payloads.
 */
export type AppContextDispatchActions =
  | {
      type: typeof ACTION_RESET_STATE
      payload: null | undefined
    }
  | {
      type: typeof ACTION_SET_ENTIRE_STATE
      payload: IGameLogicState
    }
  | {
      type: typeof ACTION_DISCOVERED_WORD
      payload: string
    }

/**
 * The reducer used in the AppContext
 */
export const gameLogicReducer = (
  state: IGameLogicState,
  action: AppContextDispatchActions
): IGameLogicState => {
  switch (action.type) {
    case ACTION_RESET_STATE:
      return getDefaultState()
    case ACTION_SET_ENTIRE_STATE:
      return clone(action.payload)
    case ACTION_DISCOVERED_WORD:
      const newWordsMap = setWordDiscovered(action.payload, state.words)
      const newPlayersGrid = buildPlayersGrid(
        state.playersGrid,
        state.gridRowSize,
        newWordsMap
      )
      return {
        ...clone(state),
        words: newWordsMap,
        playersGrid: newPlayersGrid,
      }
    default:
      return state
  }
}
