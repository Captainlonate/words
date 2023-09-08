export interface IWordsGroupedByLength {
  [key: string]: string[];
}

export function groupWordsByLength(words: string[]): IWordsGroupedByLength {
  const groupedByLength: IWordsGroupedByLength = {}

  for (const word of words) {
    groupedByLength[word.length.toString()] = groupedByLength[word.length] ?? []
    groupedByLength[word.length.toString()].push(word)
  }

  return groupedByLength;
}