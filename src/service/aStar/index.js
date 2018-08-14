import { isNavigable, distance, around } from '../map'
import type { Map, Cell } from '~/type'

const buildChain = a => (!a ? [] : [...buildChain(a.parent), a.c])

const sortFn = (a, b) => a.f - b.f

export const findPath = (map: Map, A: Cell, B: Cell): Cell[] | null => {
  const d = distance(A, B)
  const openList = [
    {
      c: A,
      parent: null,
      p: 0,
      f: d,
      d,
    },
  ]

  const closeList = []

  while (openList.length) {
    const e = openList.shift()

    if (!e.d) return buildChain(e)

    closeList.push(e.c)

    around.forEach(v => {
      const c = { x: v.x + e.c.x, y: v.y + e.c.y }

      if (!isNavigable(map, c)) return

      if (closeList.some(x => !distance(x, c))) return

      const o = openList.find(x => !distance(x.c, c))

      if (!o) {
        const d = distance(c, B)

        openList.push({ c, parent: e, p: e.p + 1, d, f: e.p + 1 + d })
      } else {
        o.d = distance(c, B)
        o.f = o.p + o.d
      }
    })

    openList.sort(sortFn)
  }

  return null
}
