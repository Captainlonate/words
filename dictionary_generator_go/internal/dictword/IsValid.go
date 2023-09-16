package dictword

import (
	"unicode"
)

func IsValid(w string) bool {
	if len(w) < 4 || len(w) > 7 {
		return false
	}

	for _, letter := range w {
		if !unicode.IsLetter(letter) {
			return false
		}
	}

	return true
}