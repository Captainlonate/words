package main

import (
	"captainlonate/words/internal/dictionary"
)

func main() {
	dictionary.CreateCleanDictionaryFile()
	dictionary.CreateSortedUniques();
}