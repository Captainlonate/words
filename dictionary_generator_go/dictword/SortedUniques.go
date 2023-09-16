package dictword


func SortedUniques(w string) (uniques string, sorted string) {
	sorted = Sort(w)
	uniques = ""
	var lastLetter rune = 0

	for _, letter := range sorted {
		if lastLetter != letter {
			uniques += string(letter)
			lastLetter = letter
		}
	}

	return
}