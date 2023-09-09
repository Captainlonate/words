/**
 * Given a set of letters, returns only the unique ones, sorted.
 *
 * [0] are the unique and sorted letters (duplicates removed)
 * [1] are the sorted letters (sorted only, with duplicates)
 *
 * Examples:
 *
 * ```
 * getUniqueSortedLetters("nathan") // => ['ahnt', 'aahnnt']
 * getUniqueSortedLetters("tablets") // => ['abelst', 'abelstt']
 * ```
 */
export function getUniqueSortedLetters(word: string): [string, string] {
  let sortedUniqueLetters: string = ''
  const sortedLettersArray: string[] = word.split('').sort()

  for (let idx = 0; idx < sortedLettersArray.length; idx++) {
    if (idx > 0 && sortedLettersArray[idx] === sortedLettersArray[idx - 1]) {
      continue
    }
    sortedUniqueLetters += sortedLettersArray[idx]
  }

  return [sortedUniqueLetters, sortedLettersArray.join('')]
}
