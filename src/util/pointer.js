import type { Point } from '~/type'

export const getPointer = (event: MouseEvent | TouchEvent): Point =>
  event.targetTouches && event.targetTouches[0]
    ? {
        x: event.targetTouches[0].clientX,
        y: event.targetTouches[0].clientY,
      }
    : { x: event.clientX || 0, y: event.clientY || 0 }
