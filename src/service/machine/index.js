import { around4 } from '~/service/map'
import type { Machine, Point, Cell, Rotation } from '~/type'

export const proj = ({ positionOrigin, rotation }: Machine) => (cell: Cell) => {
  const n = around4[rotation]

  return {
    x: positionOrigin.x + cell.x * n.x + cell.y * n.y,
    y: positionOrigin.y + cell.x * n.y - cell.y * n.x,
  }
}
