// Fastest
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
