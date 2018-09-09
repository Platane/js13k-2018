import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { boxes } from '~/renderer/texture'
import type { Point } from '~/type'

export const addEntity = (
  w: number,
  h: number,
  box: [number, number, number, number, number, number, number, number],
  alpha: number = 1
) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => (position: Point, u: Point = { x: 0, y: 1 }) => {
  const k = vertices.length / 2

  const v = { x: u.y, y: -u.x }

  // prettier-ignore
  vertices.push(
    position.x - v.x * w - u.x * h, position.y - v.y * w - u.y * h,
    position.x + v.x * w - u.x * h, position.y + v.y * w - u.y * h,
    position.x + v.x * w + u.x * h, position.y + v.y * w + u.y * h,
    position.x - v.x * w + u.x * h, position.y - v.y * w + u.y * h,
  )

  opacity.push(alpha, alpha, alpha, alpha)

  uvs.push(...(box || boxes.defaultBox))

  // prettier-ignore
  index.push(
    k+0, k+1, k+2,
    k+0,  k+2, k+3,
  )
}
