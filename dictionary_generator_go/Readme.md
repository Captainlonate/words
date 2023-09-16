# Dictionary File Generator (golang)

This project builds custom dictionary files, that the other projects in this repo depend on.

## Why?

> Problem to solve: Given a set of letters and a dictionary.txt file, find every word in the dictionary that can be built from those letters.

In this case, you must compare the letters against __every__ 🫣 word in the dictionary. __That's slow!__

Is there any way we could preprocess the dictionary file that would reduce the number of string comparisons?

That's what this project does.

## Commands

_Run the code (it generates files into ./assets/)_

```bash
# You need to be in same directory as the assets/ directory.
# Be in this directory (with the Readme)
# Option 1)
go run ./cmd/cmdAll/cmdAll.go
# Option 2)
make dev
```

_Build the CLI (puts it in ./build/)_

```bash
# Option 1) With make
make
# Option 2) With go
go build -o ./build/goWords ./cmd/cmdAll/cmdAll.go
```

## The approach I took

So as I was saying, we don't want to compare our letters to each word in [the dictionary](./assets/clean_words.txt). What if the dictionary has a lot of words? And what if we want to do lots of lookups? Imagine if we wanted to do a lookup in real time as a user types letters into a text box.

```
// ❌ Slow approach using basic dictionary file
all_dictionary_words.filter((word) => can_a_create_b(letters, word))
```

So, to create my custom dictionary file, I do the following:

Reduce each dictionary word into sorted & unique letters
```
// word  ->  sorted  ->  sorted & unique
"armor"  ->  "amorr" ->  "amor"
```

Then I create a map:
```json
assets/sorted_uniques.json
{
  // sorted & unique letters
  "amor": [
    // [sorted letters, original word]
    ["amorr", "armor"],
    ["aamor", "aroma"],
    ["amor",  "roam"]
  ],
  "amors":[
    ["amorrs", "armors"],
    ["aamors", "aromas"],
    ["amorss", "morass"],
    ["amors",  "roams"]
  ],
  "amo":[
    ["ammo","ammo"],
    ["ammmo","momma"]
  ],
  "aor":[
    ["aorr","roar"]
  ]
}
```

That's what the new custom [dictionary JSON file](./assets/sorted_uniques.json) looks like.

Now when the user types some letters into the box, I do a similar process

- The user types the letters: `"maroa"`
- I find the sorted and unique letters: `"amor"`
- I create a Power Set:
  - `["a", "m", "o", "r", "am", "ao", "ar", "mo", "mr", "or", "amo", "amr", "aor", "amor"]`
  - It's important that each substring remains sorted alphabetically
- I check the map for each substring and combine the arrays
  - `[].concat(sorted_uniques["amo"], sorted_uniques["amor"], sorted_uniques["aor"], etc...)`
- The combined list of possible words to compare is usually very small (under 50, under 25)
- My comparison algorithm uses the two-pointer loop approach, which requires both strings to be sorted. But since I pre-sorted all dictionary words in the tuples I won't have to sort them during a lookup. So I just compare a few letters per word.

