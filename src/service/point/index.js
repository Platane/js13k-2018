import type { Point, Cell } from '~/type'

export const pointToCell = ({ x, y }: Point): Cell => ({
  x: Math.floor(x),
  y: Math.floor(y),
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
