package dictionary

import (
	"fmt"
	"os"
	"strings"
)

func readCleanDictionary(filePath string) []string {
	dictionaryString, err := os.ReadFile(filePath)
	if err != nil {
		panic(fmt.Sprintf("Unable to read clean dictionary: '%s'", filePath))
	}

	allWords := strings.Split(string(dictionaryString), "\n")

	return allWords
}