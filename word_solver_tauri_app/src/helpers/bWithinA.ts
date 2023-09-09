/**
 * Does the `subSet` of characters fit within the `superSet` of characters.
 *
 * The MOST important thing to know is that both sets of characters
 * need to be pre-sorted alphabetically before passed to this fn.
 *
 * It returns true if:
 * - All of the characters in the subSet appear within the superSet.
 * - And they must appear AT LEAST as many times in the superSet
 *
 * Examples:
 *
 * ```
 * bWithinA("aahnnt", "an") // == true
 * bWithinA("aahnnt", "ann") // == true
 * bWithinA("aahnnt", "annn") // == false (too many n's)
 *
 * bWithinA("abcd", "bd") // == true
 * bWithinA("abcd", "abb") // == false (too many b's)
 * ```
 */
export function bWithinA(superSet: string, subSet: string): boolean {
  let subSetPointer: number = 0
  let superSetPointer: number = 0
  let subSetLetter: string = ''
  let superSetLetter: string = ''

  if (subSet.length > superSet.length) {
    return false
  }

  while (subSetPointer < subSet.length) {
    subSetLetter = subSet[subSetPointer]
    superSetLetter = superSet[superSetPointer]

    if (subSetLetter === superSetLetter) {
      subSetPointer++
    }

    superSetPointer++

    if (superSetPointer >= superSet.length && subSetPointer < subSet.length) {
      return false
    }
  }

  return true
}
