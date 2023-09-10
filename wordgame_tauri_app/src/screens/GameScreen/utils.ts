import testGridsJSON from '../../boards.json'
import { IGeneratedBoardParsedJSON } from './GameLogic/utils'

export async function fetchNewBoard(): Promise<IGeneratedBoardParsedJSON> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Array.isArray(testGridsJSON) && testGridsJSON.length > 0) {
        const generatedBoard = testGridsJSON[4] as IGeneratedBoardParsedJSON
        resolve(generatedBoard)
      } else {
        reject()
      }
    }, 0)
  })
}
