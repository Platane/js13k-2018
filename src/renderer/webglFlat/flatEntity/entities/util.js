import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { boxes } from '~/renderer/texture'

export const addEntity = (
  size: number,
  box: [number, number, number, number]
) => (vertices: number[], uvs: number[], index: number[]) => (
  position: Point,
  u: Point = { x: 0, y: 1 }
) => {
  const k = vertices.length / 2

  const v = { x: u.y, y: -u.x }

  // prettier-ignore
  vertices.push(
    position.x - v.x * size - u.x * size, position.y - v.y * size - u.y * size,
    position.x + v.x * size - u.x * size, position.y + v.y * size - u.y * size,
    position.x + v.x * size + u.x * size, position.y + v.y * size + u.y * size,
    position.x - v.x * size + u.x * size, position.y - v.y * size + u.y * size,
  )

  uvs.push(...(box || boxes.defaultBox))

  // prettier-ignore
  index.push(
    k+0, k+1, k+2,
    k+0,  k+2, k+3,
  )
}
