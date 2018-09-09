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

export const renderLine = (A: Point, B: Point, box, alpha) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => {
  const BA = { x: B.x - A.x, y: B.y - A.y }
  const l = length(BA)
  const c = { x: (B.x + A.x) * 0.5, y: (B.y + A.y) * 0.5 }
  const v = { x: BA.y / l, y: -BA.x / l }

  addEntity(l / 2 + 0.02, 0.05, box, alpha)(vertices, uvs, opacity, index)(c, v)

  // addEntity(0.1, 0.1, boxes.black)(vertices, uvs, opacity, index)(A)
  // addEntity(0.1, 0.1, boxes.black)(vertices, uvs, opacity, index)(B)
}

export const renderPath = (path: Point[], box, alpha) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) =>
  path.length == 1
    ? renderLine(path[0], { x: path[0].x + 0.05, y: path[0].y }, box, alpha)(
        vertices,
        uvs,
        opacity,
        index
      )
    : path.forEach(
        (B, i) =>
          i > 0 &&
          renderLine(path[i - 1], B, box, alpha)(vertices, uvs, opacity, index)
      )
