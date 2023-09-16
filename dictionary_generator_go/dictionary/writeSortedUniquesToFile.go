package dictionary

import (
	"encoding/json"
	"fmt"
	"os"
)

func writeSortedUniquesToFile(sortedUniquesMap map[string][][]string, pathToSortedUniques string) {
	sortedUniquesJson, err := json.Marshal(sortedUniquesMap)
	if err != nil {
		panic(fmt.Sprintf("Unable to marshal sorted uniques: '%s'", err))
	}

	err = os.WriteFile(pathToSortedUniques, sortedUniquesJson, 0644)
	if err != nil {
		panic(fmt.Sprintf("Unable to write sorted uniques: '%s'", err))
	}
}