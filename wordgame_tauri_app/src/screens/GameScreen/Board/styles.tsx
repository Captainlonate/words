import styled from 'styled-components'

const CELL_GAP = '0.5vw'

export const BoardContainer = styled.div`
  display: flex;
  aspect-ratio: 1 / 1;
  height: 100%;
  flex-direction: column;
  gap: ${CELL_GAP};
  box-sizing: border-box;
`

export const GridRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${CELL_GAP};
  box-sizing: border-box;
`

export const GridCell = styled.div<{ isSlot: boolean; isFound: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  aspect-ratio: 1 / 1;
  border: 1px solid transparent;
  border-radius: 15%;
  background-color: ${({ isFound, isSlot }) =>
    isFound ? 'gold' : isSlot ? 'white' : 'transparent'};
  color: ${({ isFound }) => (isFound ? 'black' : 'white')};
  font-weight: bold;
  box-sizing: border-box;
  font-size: 2vh;
`
