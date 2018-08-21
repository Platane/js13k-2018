import { isNavigable, getHeight, getWidth } from '~/service/map'
import { normalize, lengthSq } from '~/service/point'
import { proj as projMachine } from '~/service/machine'
import { proj } from '~/service/camera'
import { hashCode } from '~/util/hash'

import type { Universe, Camera } from '~/type'

const randomColor = (str: string) => `hsl(${hashCode(str)},80%,50%)`

export const draw = (
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  universe: Universe
) => {
  //

  ctx.beginPath()
  ctx.rect(-4999, -4999, 9999, 9999)
  ctx.fillStyle = '#aaa'
  ctx.fill()

  ctx.clearRect(0, 0, getHeight(universe.map), getWidth(universe.map))

  const p = proj(camera)

  // map
  for (let y = getHeight(universe.map); y--; )
    for (let x = getWidth(universe.map); x--; ) {
      const a = p({ x, y })

      ctx.fillStyle = isNavigable(universe.map, { x, y }) ? '#eee' : '#aaa'
      ctx.beginPath()
      ctx.rect(a.x, a.y, camera.a, camera.a)
      ctx.fill()
    }

  // grid
  const l = 60
  for (let k = -l; k < l; k++) {
    const a = p({ x: k, y: l })
    const b = p({ x: k, y: -l })

    ctx.lineWidth = 0.6

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
  universe.machines.forEach(m => {
    const pm = projMachine(m)

    const { ground, inputs, outputs } = m.blueprint

    for (let y = getHeight(ground); y--; )
      for (let x = getWidth(ground); x--; ) {
        const c = { x, y }

        const a = p(pm(c))

        ctx.fillStyle = isNavigable(ground, c) ? 'transparent' : 'blue'
        ctx.beginPath()
        ctx.rect(
          a.x + camera.a * 0.1,
          a.y + camera.a * 0.1,
          camera.a * 0.8,
          camera.a * 0.8
        )
        ctx.fill()
      }

    outputs.forEach(({ cell }) => {
      const a = p(pm(cell))

      ctx.fillStyle = 'green'
      ctx.beginPath()
      ctx.rect(
        a.x + camera.a * 0.3,
        a.y + camera.a * 0.3,
        camera.a * 0.4,
        camera.a * 0.4
      )
      ctx.fill()
    })

    inputs.forEach(({ cell }) => {
      const a = p(pm(cell))

      ctx.fillStyle = 'yellow'
      ctx.beginPath()
      ctx.rect(
        a.x + camera.a * 0.3,
        a.y + camera.a * 0.3,
        camera.a * 0.4,
        camera.a * 0.4
      )
      ctx.fill()
    })
  })

  // bots
  universe.bots.forEach(b => {
    const a = p(b.position)

    ctx.lineWidth = 1.2

    ctx.beginPath()
    ctx.arc(a.x, a.y, 4, 0, Math.PI * 2)
    ctx.stroke()

    if (lengthSq(b.velocity) > 0.001) {
      const po = {
        x: a.x + b.velocity.x * 100,
        y: a.y + b.velocity.y * 100,
      }

      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(po.x, po.y)
      ctx.stroke()
    }

    if (b.command.type === 'carry' && b.activity.carrying) {
      const token = b.activity.carrying

      const v = normalize(b.velocity)

      const c = {
        x: a.x - v.x * 4,
        y: a.y - v.y * 4,
      }

      ctx.beginPath()
      ctx.fillStyle = randomColor(token)
      ctx.arc(c.x, c.y, 5, 0, Math.PI * 2)
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
