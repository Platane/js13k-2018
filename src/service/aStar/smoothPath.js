import { rayCastCheck, isNavigable } from '~/service/map'
import { cellCenter } from '~/service/point'
import type { Map, Cell } from '~/type'

export const smoothPath = (map: Map, [A, ...path]: Cell[]): Cell[] => {
  if (!A) return []

  // return the farest cell reachable
  const isReachable = E =>
    rayCastCheck(c => isNavigable(map, c), cellCenter(A), cellCenter(E))

  while (path[1] && isReachable(path[1])) path.shift()

  return [A, ...smoothPath(map, path)]
}
