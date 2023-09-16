package dictword

import (
	"strings"
)

func Normalize(w string) string {
	return strings.ToLower(strings.TrimSpace(w))
}