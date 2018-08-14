import type { Point, Camera } from '~/type'

export const proj = ({ a, t }: Camera) => (p: Point) => ({
  x: p.x * a + t.x,
  y: p.y * a + t.y,
})
