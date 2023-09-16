package main

import (
	"captainlonate/words/dictionary"
)

func main() {
	dictionary.CreateCleanDictionaryFile()
	dictionary.CreateSortedUniques();
}