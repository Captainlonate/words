import { Subject } from 'rxjs'
import { useEffect, useState } from 'react'

interface ILettersState {
  lettersInProgress: string
}

const subject = new Subject<ILettersState>()

const initialState: ILettersState = {
  lettersInProgress: '',
}

let state = initialState

export function useLettersStore() {
  const [letters, setLetters] = useState<string>(initialState.lettersInProgress)

  useEffect(() => {
    const subscription = subject.subscribe((value) => {
      setLetters(value?.lettersInProgress ?? 'NO VALUE')
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [subject, setLetters])

  return letters
}

export const lettersStore = {
  /**
   *
   */
  subscribe: (setState: (val: ILettersState) => void) =>
    subject.subscribe(setState),
  /**
   *
   */
  setLetters: (newLettersInProgress: string) => {
    state = { ...state, lettersInProgress: newLettersInProgress }
    subject.next(state)
  },
  /**
   *
   */
  resetStore: () => {
    state = { ...state, lettersInProgress: '' }
    subject.next(state)
  },
}
