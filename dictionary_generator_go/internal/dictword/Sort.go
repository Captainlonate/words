package dictword

import (
	"sort"
	"strings"
)

func Sort(w string) string {
	s := strings.Split(w, "")
	sort.Strings(s)
	return strings.Join(s, "")
}