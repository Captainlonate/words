package dictionary

import "captainlonate/words/dictword"

func createSortedUniqueMap(allCleanWords []string) map[string][][]string {
	sortedUniquesMap := make(map[string][][]string)

	for _, word := range allCleanWords {
		uniqueAndSorted, sortedWord := dictword.SortedUniques(word)

		if _, exists := sortedUniquesMap[uniqueAndSorted]; !exists {
			sortedUniquesMap[uniqueAndSorted] = [][]string{{sortedWord, word}}
		} else {
			sortedUniquesMap[uniqueAndSorted] = append(sortedUniquesMap[uniqueAndSorted], []string{sortedWord, word})
		}
	}

	return sortedUniquesMap
}