import { distanceSq, closestPointOnSegment } from '~/service/point'
import { around4, isNavigable, getWidth, getHeight } from '~/service/map'
import type { Machine, Point, Cell, Rotation, Map } from '~/type'

export const proj = ({ positionOrigin, rotation }: Machine) => (cell: Cell) => {
  const n = around4[rotation]

  return {
    x: positionOrigin.x + cell.x * n.x + cell.y * n.y,
    y: positionOrigin.y + cell.x * n.y - cell.y * n.x,
  }
}

export const getClosestPointToMachine = (
  map: Map,
  machine: Machine,
  point: Point
): Point | null => {
  let min_d = Infinity
  let closestPoint = null

  const p = proj(machine)

  for (let x = getWidth(machine.blueprint.ground); x--; )
    for (let y = getHeight(machine.blueprint.ground); y--; ) {
      const cell = p({ x, y })

      if (!isNavigable(map, cell))
        for (let k = around4.length; k--; ) {
          const v = around4[k]

          const o = { x: cell.x + v.x, y: cell.y + v.y }

          if (isNavigable(map, o)) {
            const A = {
              x: cell.x + 0.5 + v.x * 0.5 + 0.5 * v.y,
              y: cell.y + 0.5 + v.y * 0.5 - 0.5 * v.x,
            }

            const N = { x: -v.y, y: v.x }

            const c = closestPointOnSegment(A, N, point)

            const d = distanceSq(c, point)

            if (d < min_d) {
              min_d = d
              closestPoint = c
              closestPoint.x += v.x * 0.22
              closestPoint.y += v.y * 0.22
            }
          }
        }
    }

  return closestPoint
}
