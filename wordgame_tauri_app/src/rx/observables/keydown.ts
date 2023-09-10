import { filter, fromEvent, map } from 'rxjs'

const keyDownEvent$ = fromEvent<KeyboardEvent>(document, 'keydown')

export const pipedKeyDownEvent$ = keyDownEvent$.pipe(
  map((event) => event?.key ?? ''),
  filter((key) => !!key)
)
