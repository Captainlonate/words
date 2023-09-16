package dictionary

import (
	"os"
	"strings"
)

func writeTxtFile(cleanWords []string, filePath string) error {
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	var joinedWords string = strings.Join(cleanWords, "\n")

	_, err = file.WriteString(joinedWords)
	if err != nil {
		return err
	}

	return nil
}