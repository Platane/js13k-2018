import type { Map, Cell } from '~/type'

export const isInside = (map: Map, { x, y }: Cell): boolean =>
  0 <= x && x < map[0].length && 0 <= y && y < map.length

export const isNavigable = (map: Map, c: Cell): boolean =>
  isInside(map, c) && !map[c.y][c.x]

export const isWall = (map: Map, c: Cell): boolean =>
  !isInside(map, c) || !map[c.y][c.x]

export const distance = (a: Cell, b: Cell) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

export const around: Cell[] = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
]
