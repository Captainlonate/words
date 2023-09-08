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
