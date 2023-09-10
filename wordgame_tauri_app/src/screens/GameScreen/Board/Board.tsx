import * as Styled from './styles'
import { splitEvery } from 'ramda'
import { useMemo } from 'react'

interface IBoardProps {
  /**
   * String in the format
   * "####--#####----##MAGE#"
   * - `#` Represents nonused cell
   * - `-` Represents an undiscovered letter cell
   * - `A-Z` Represents a discovered letter cell
   */
  playersGrid: string
  rowSize: number
}

export const Board = ({ playersGrid, rowSize }: IBoardProps) => {
  if (rowSize === 0) {
    return null
  }

  const grid = useMemo(
    () =>
      splitEvery(rowSize, playersGrid).map((row, rowIdx) => (
        <Styled.GridRow key={`row-${rowIdx}`}>
          {row.split('').map((cell, cellIdx) => (
            <Styled.GridCell
              key={`cell-${cellIdx}}`}
              isSlot={cell === '-'}
              isFound={cell !== '#' && cell !== '-'}
            >
              {cell !== '#' && cell !== '-' ? cell : ''}
            </Styled.GridCell>
          ))}
        </Styled.GridRow>
      )),
    [playersGrid, rowSize]
  )

  return <Styled.BoardContainer>{grid}</Styled.BoardContainer>
}
