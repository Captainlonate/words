import { bWithinA } from './bWithinA'
import { generateAllLetterCombinations } from './generateAllLetterCombinations'
import { getUniqueSortedLetters } from './getUniqueSortedLetters'
import { sortedUniqueLettersJson } from '../data/sortedUniqueLettersJson'

/**
 * The main "algorithm" or "lookup" function.
 * It takes some letters (that the user types in) and returns
 * all the words that can be constructed from those letters.
 */
export function findMatchesSortedUniqueLetters(
  lookupLetters: string
): string[] {
  const matches: string[] = []

  const [sortedUniqueLetters, sortedLookupLettersStr] =
    getUniqueSortedLetters(lookupLetters)

  const letterCombinations: string[] =
    generateAllLetterCombinations(sortedUniqueLetters)

  // Micro optimization - cache length and use for..init loop
  const numCombinations: number = letterCombinations.length
  for (let idx = 0; idx < numCombinations; idx++) {
    const wordsForTheseLetters =
      sortedUniqueLettersJson[letterCombinations[idx]]

    if (wordsForTheseLetters) {
      for (const [sortedDictLetters, dictWord] of wordsForTheseLetters) {
        if (bWithinA(sortedLookupLettersStr, sortedDictLetters)) {
          matches.push(dictWord)
        }
      }
    }
  }

  return matches
}
