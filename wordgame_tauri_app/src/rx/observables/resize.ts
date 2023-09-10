import { fromEvent, throttleTime } from 'rxjs'

const resizeEvent$ = fromEvent(window, 'resize')

export const pipedResizeEvent$ = resizeEvent$.pipe(throttleTime(300))
