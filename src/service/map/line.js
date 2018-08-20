import type { Cell, Point } from '~/type'
import { pointEqual } from '~/service/point'

const pointToCell = ({ x, y }: Point): Cell => ({
  x: Math.floor(x),
  y: Math.floor(y),
})

const EPSYLON = 0.00001

export const rayCastCheck = (
  check: (Cell: Cell) => boolean,
  A: Point,
  B: Point
): boolean => {
  const a = pointToCell(A)
  const b = pointToCell(B)

  if (!check(a)) return false

  if (pointEqual(a, b)) return true

  const vx = B.x - A.x
  const vy = B.y - A.y

  const _ax = ((A.x % 1) + 1) % 1
  const _ay = ((A.y % 1) + 1) % 1

  const tx = vx >= 0 ? (1 - _ax) / vx : -_ax / vx
  const ty = vy >= 0 ? (1 - _ay) / vy : -_ay / vy

  const t = Math.min(tx, ty) + EPSYLON

  const E = { x: A.x + t * vx, y: A.y + t * vy }

  return rayCastCheck(check, E, B)
}
