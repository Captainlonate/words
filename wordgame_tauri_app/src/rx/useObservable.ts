import { useEffect } from 'react'
import { Observable } from 'rxjs'

export function useObservable<T>(
  observable: Observable<T>,
  callback: (val: T) => void
) {
  useEffect(() => {
    const subscription = observable.subscribe((value) => {
      callback(value)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [observable, callback])
}
