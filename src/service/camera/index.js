import type { Point, Camera } from '~/type'

export const proj = ({ a, t }: Camera) => (p: Point) => ({
  x: p.x * a + t.x,
  y: p.y * a + t.y,
})

export const unproj = ({ a, t }: Camera) => (p: Point) => ({
  x: (p.x - t.x) / a,
  y: (p.y - t.y) / a,
})
