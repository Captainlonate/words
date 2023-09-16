package dictionary

import (
	"fmt"
	"os"
)

func CreateSortedUniques() {
	cwd, _ := os.Getwd()
	
	// Fetch all of the clean dictionary words
	pathToCleanDictionary := fmt.Sprintf("%s/assets/%s", cwd, CLEAN_DICTIONARY_FILENAME)
	var allCleanWords []string = readCleanDictionary(pathToCleanDictionary)

	// Generate a map of sorted unique letters, to the words that
	// can be distilled down to those letters
	var sortedUniquesMap map[string][][]string = createSortedUniqueMap(allCleanWords)

	pathToSortedUniques := fmt.Sprintf("%s/assets/%s", cwd, SORTED_UNIQUES_FILENAME)
	writeSortedUniquesToFile(sortedUniquesMap, pathToSortedUniques)
	fmt.Printf("Uniques Dictionary:\n\t'%s'\n", pathToSortedUniques)
}