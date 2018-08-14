import { proj } from '~/service/camera'
import { isNavigable } from '~/service/map'
import type { Universe, Camera } from '~/type'

export const draw = (
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  universe: Universe
) => {
  //

  ctx.clearRect(0, 0, 9999, 9999)

  const p = proj(camera)

  // map
  for (let y = universe.map.length; y--; )
    for (let x = universe.map[0].length; x--; ) {
      const a = p({ x, y })

      ctx.fillStyle = isNavigable(universe.map, { x, y }) ? '#eee' : '#aaa'
      ctx.beginPath()
      ctx.rect(a.x, a.y, camera.a, camera.a)
      ctx.fill()
    }

  // grid
  for (let k = -100; k < 100; k++) {
    const a = p({ x: k, y: 100 })
    const b = p({ x: k, y: -100 })

    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()

    const u = p({ y: k, x: 100 })
    const v = p({ y: k, x: -100 })

    ctx.beginPath()
    ctx.moveTo(u.x, u.y)
    ctx.lineTo(v.x, v.y)
    ctx.stroke()
  }

  // machines
  universe.machines.forEach(m => {})

  // bots
  universe.bots.forEach(b => {
    const a = p(b.position)

    const po = {
      x: a.x + b.direction.x * 16,
      y: a.y + b.direction.y * 16,
    }

    ctx.beginPath()
    ctx.arc(a.x, a.y, 4, 0, Math.PI * 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(po.x, po.y)
    ctx.stroke()
  })
}
