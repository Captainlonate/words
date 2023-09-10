/**
 *
 * Example
 * ```
 * doesSetAContainSetB(['A'], ['A']) // true
 * doesSetAContainSetB(['A', 'B'], ['A']) // true
 * doesSetAContainSetB(['A', 'A'], ['A']) // true
 * doesSetAContainSetB([''], ['']) // true
 *
 * doesSetAContainSetB(['A'], ['B']) // false
 * doesSetAContainSetB(['A'], ['A', 'A']) // false
 * doesSetAContainSetB(['A', 'A'], ['A', 'B']) // false
 * doesSetAContainSetB([], ['B']) // false
 * ```
 */
export function doesSetAContainSetB(setA: string[], setB: string[]): boolean {
  // Example: { A: 2, B: 1, C: 1 }
  const countedItems = setA.reduce((obj, item) => {
    obj[item] = (obj[item] ?? 0) + 1
    return obj
  }, {} as { [key: string]: number })

  for (const itemFromSetB of setB) {
    // Doesn't exist in object, or is already 0
    if (!countedItems[itemFromSetB]) {
      return false
    }
    countedItems[itemFromSetB] = countedItems[itemFromSetB] - 1
  }

  return true
}
