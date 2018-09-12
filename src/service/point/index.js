import type { Point, Cell } from '~/type'

export const pointToCell = ({ x, y }: Point): Cell => ({
  x: Math.floor(x),
  y: Math.floor(y),
})

export const cellCenter = ({ x, y }: Point): Point => ({
  x: Math.floor(x) + 0.5,
  y: Math.floor(y) + 0.5,
})

export const pointEqual = (A: Point, B: Point) => A.x === B.x && A.y === B.y

export const lengthSq = (A: Point) => A.x * A.x + A.y * A.y

export const length = (A: Point) => Math.sqrt(lengthSq(A))

export const normalize = (A: Point) => {
  const l = length(A)

  return {
    x: A.x / l,
    y: A.y / l,
  }
}

export const distanceSq = (A: Point, B: Point) =>
  lengthSq({ x: A.x - B.x, y: A.y - B.y })

export const distance = (A: Point, B: Point) => Math.sqrt(distanceSq(A, B))

// A is one extremum of the segment
// A + V is the other
// P is the point to be close
export const closestPointOnSegment = (
  A: Point,
  V: Point,
  P: Point,
  m: number = 0
): Point => {
  const APx = P.x - A.x
  const APy = P.y - A.y

  const l = APx * V.x + APy * V.y

  const k = Math.min(1 - m, Math.max(m, l))

  return {
    x: A.x + V.x * k,
    y: A.y + V.y * k,
  }
}
