package dictionary

import (
	"bufio"
	"fmt"
	"os"

	"captainlonate/words/internal/dictword"
)

func CreateCleanDictionaryFile() {
	// File Paths (expects to be from project root)
	cwd, _ := os.Getwd()
	pathToFullDictionary := fmt.Sprintf("%s/assets/%s", cwd, BASE_DICTIONARY_FILENAME)
	pathToBadDictionary := fmt.Sprintf("%s/assets/%s", cwd, BAD_WORDS_FILENAME)
	pathToCleanDictionary := fmt.Sprintf("%s/assets/%s", cwd, CLEAN_DICTIONARY_FILENAME)

	// Hold clean and bad words
	var cleanWords []string
  badWordsMap := readBadWordsFileIntoMap(pathToBadDictionary)

	// Open the Full Dictionary File (close it later)
	fullDictFile, err := os.Open(pathToFullDictionary)
	if err != nil {
		panic(fmt.Sprintf("Unable to read full dictionary: '%s'", pathToFullDictionary))
	}
	defer fullDictFile.Close()

	// Read and process each word from the full dictionary to see if
	// it's a valid & clean word to be saved
	fullDictScanner := bufio.NewScanner(fullDictFile)
	for fullDictScanner.Scan() {
		word := dictword.Normalize(fullDictScanner.Text())

		if dictword.IsValid(word) {
			if _, isBadWord := badWordsMap[word]; !isBadWord {
				cleanWords = append(cleanWords, word)
			}
		}
	}

	if err := fullDictScanner.Err(); err != nil {
		panic(fmt.Sprintf("Scanner error reading full dictionary: '%s'", pathToFullDictionary))
	}

	writeTxtFile(cleanWords, pathToCleanDictionary)
	fmt.Printf("Clean Dictionary:\n\t'%s'\n", pathToCleanDictionary)
}