package dictionary

import (
	"bufio"
	"captainlonate/words/internal/dictword"
	"fmt"
	"os"
)

func readBadWordsFileIntoMap(filePath string) map[string]bool {
	file, err := os.Open(filePath)
	if err != nil {
		panic(fmt.Sprintf("Unable to read bad dictionary: '%s'", filePath))
	}
	defer file.Close()

	var linesMap map[string]bool = make(map[string]bool)
	fileScanner := bufio.NewScanner(file)
	for fileScanner.Scan() {
		word := dictword.Normalize(fileScanner.Text())

		if dictword.IsValid(word) {
			linesMap[word] = true
		}
	}

	if err := fileScanner.Err(); err != nil {
		panic(fmt.Sprintf("Scanner error reading bad dictionary: '%s'", filePath))
	}

	return linesMap
}