export interface IWordsGroupedByLength {
  [key: string]: string[]
}

/**
 * Takes an array of words. Returns an object that groups the words
 * by how many letters are in each word.
 * So, all the 3 letter words will end up in an array, etc.
 *
 * ```
 * {
 *   "3": ["the", "end"],
 *   "4": ["four", ...],
 *   "5": ["table", ...],
 * }
 * ```
 */
export function groupWordsByLength(words: string[]): IWordsGroupedByLength {
  const groupedByLength: IWordsGroupedByLength = {}

  for (const word of words) {
    groupedByLength[word.length.toString()] = groupedByLength[word.length] ?? []
    groupedByLength[word.length.toString()].push(word)
  }

  return groupedByLength
}
