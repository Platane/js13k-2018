export * from './constant'
export * from './line'
import type { Map, Cell } from '~/type'

export const isInside = (map: Map, { x, y }: Cell): boolean =>
  0 <= x && x < getWidth(map) && 0 <= y && y < getHeight(map)

export const isNavigable = (map: Map, c: Cell): boolean =>
  isInside(map, c) && !map[c.y][c.x]

export const getHeight = (map: Map) => map.length

export const getWidth = (map: Map) => map[0].length

export const distance = (a: Cell, b: Cell) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
