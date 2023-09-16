package dictword

import (
	"unicode"
)

// min and max VALID word lengths to make it into the clean dictionary
const MIN_WORD_LENGTH int = 3
const MAX_WORD_LENGTH int = 7

func IsValid(w string) bool {
	if len(w) < MIN_WORD_LENGTH || len(w) > MAX_WORD_LENGTH {
		return false
	}

	for _, letter := range w {
		if !unicode.IsLetter(letter) {
			return false
		}
	}

	return true
}