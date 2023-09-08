/**
 * Yes, this is the ugliest function you've ever seen.
 * Yes, I did nest 7 loops.
 *
 * This was dramatically faster than any "Power Set" solutions
 * that I found online (especially the horrible recursive ones).
 * The recursive ones were INCREDIBLY slow compared to this.
 * I also found some loop-based ones, which were still somehow
 * 3 times slower than mine below.
 *
 * I must have tried 15 or more different solutions from the internet,
 * and my ugly one smoked all of them.
 */
export function generateAllLetterCombinations(lettersString: string): string[] {
  const lettersArray: string[] = lettersString.split('')
  const combinations: string[] = []

  let twoStr: string = ''
  let threeStr: string = ''
  let fourStr: string = ''
  let fiveStr: string = ''
  let sixStr: string = ''

  // Cache the value to speed up loops
  const numLetters: number = lettersArray.length

  for (let idx1 = 0; idx1 < numLetters; idx1++) {
    for (let idx2 = idx1 + 1; idx2 < numLetters; idx2++) {
      // Add the 2 combination
      twoStr = lettersArray[idx1] + lettersArray[idx2]
      combinations.push(twoStr)

      for (let idx3 = idx2 + 1; idx3 < numLetters; idx3++) {
        // Add the 3-letter combinations
        threeStr = twoStr + lettersArray[idx3]
        combinations.push(threeStr)

        for (let idx4 = idx3 + 1; idx4 < numLetters; idx4++) {
          // Add the 4-letter combinations
          fourStr = threeStr + lettersArray[idx4]
          combinations.push(fourStr)
          if (numLetters > 4) {
            for (let idx5 = idx4 + 1; idx5 < numLetters; idx5++) {
              // Add the 5-letter combinations
              fiveStr = fourStr + lettersArray[idx5]
              combinations.push(fiveStr)
              if (numLetters > 5) {
                for (let idx6 = idx5 + 1; idx6 < numLetters; idx6++) {
                  // Add the 6-letter combinations
                  sixStr = fiveStr + lettersArray[idx6]
                  combinations.push(sixStr)
                  if (numLetters > 6) {
                    for (let idx7 = idx6 + 1; idx7 < numLetters; idx7++) {
                      // Add the 7-letter combinations
                      combinations.push(sixStr + lettersArray[idx7])
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return combinations
}
