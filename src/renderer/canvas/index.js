import { proj } from '~/service/camera'
import { isNavigable, getHeight, getWidth } from '~/service/map'
import { normalize } from '~/service/point'
import { hashCode } from '~/util/hash'

import type { Universe, Camera } from '~/type'

const randomColor = str => `hsl(${hashCode(str)},80%,60%)`

export const draw = (
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  universe: Universe
) => {
  //

  ctx.clearRect(0, 0, 9999, 9999)

  const p = proj(camera)

  // map
  for (let y = getHeight(universe.map); y--; )
    for (let x = getHeight(universe.map); x--; ) {
      const a = p({ x, y })

      ctx.fillStyle = isNavigable(universe.map, { x, y }) ? '#eee' : '#aaa'
      ctx.beginPath()
      ctx.rect(a.x, a.y, camera.a, camera.a)
      ctx.fill()
    }

  // grid
  const l = 20
  for (let k = -l; k < l; k++) {
    const a = p({ x: k, y: l })
    const b = p({ x: k, y: -l })

    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()

    const u = p({ y: k, x: l })
    const v = p({ y: k, x: -l })

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
      x: a.x + b.velocity.x * 100,
      y: a.y + b.velocity.y * 100,
    }

    ctx.beginPath()
    ctx.arc(a.x, a.y, 4, 0, Math.PI * 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(po.x, po.y)
    ctx.stroke()

    if (b.command.type === 'carry' && b.activity.carrying) {
      const token = b.activity.carrying

      const v = normalize(b.velocity)

      const c = {
        x: a.x - v.x * 4,
        y: a.y - v.y * 4,
      }

      ctx.beginPath()
      ctx.fillStyle = randomColor(token)
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  // dropped tokens
  universe.droppedTokens.forEach(({ position, token }) => {
    const a = p(position)

    ctx.beginPath()
    ctx.fillStyle = randomColor(token)
    ctx.arc(a.x, a.y, 4, 0, Math.PI * 2)
    ctx.fill()
  })
}