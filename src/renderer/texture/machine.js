import { plank_light, plank_mid } from '~/config/palette'
import {
  around8,
  isInside,
  getWidth,
  getHeight,
  isNavigable,
  isContructible,
} from '~/service/map'
import { l, offset, ctx, getNextBox, addBox } from './tex'
import { blueprints } from '~/config/blueprints'
import { proj } from '~/service/machine'
import type { Map } from '~/type'

const buffer = document.createElement('canvas')
buffer.height = buffer.width = 600

// window.document.body.appendChild(buffer)
// buffer.style.cssText =
//   'border:solid 3px red;z-index:10;top:10px;left:560px;width:200px;height:200px;position:absolute;background-color:yellow'

const ctxbuffer = buffer.getContext('2d')
ctxbuffer.scale(100, 100)

const isBlock = (map, c) => isInside(map, c) && isNavigable(map, c)

const drawMachineHull = (ground: Map) => {
  const w = getWidth(ground)
  const h = getHeight(ground)

  ctxbuffer.clearRect(0, 0, 9, 9)

  for (let x = w; x--; )
    for (let y = h; y--; ) {
      ctxbuffer.fillStyle = !isNavigable(ground, { x, y })
        ? '#000'
        : 'transparent'

      const m = 0.12

      ctxbuffer.fillRect(
        //
        y + m,
        x + m,
        1 - m * 2,
        1 - m * 2
      )

      for (let k = 8; k--; ) {
        const v = around8[k]

        const c = { x: v.x + x, y: v.y + y }

        if (!isNavigable(ground, c) && isInside(ground, c)) {
          if (v.x * v.y === 0)
            ctxbuffer.fillRect(
              //
              y + m + v.y * 0.5,
              x + m + v.x * 0.5,
              1 - m * 2,
              1 - m * 2
            )
          else if (
            !isNavigable(ground, { x, y: y + v.y }) &&
            !isNavigable(ground, { x: x + v.x, y }) &&
            !false
          ) {
            ctxbuffer.fillRect(
              y + m + v.y * 0.5,
              x + m + v.x * 0.5,
              1 - m * 2,
              1 - m * 2
            )
          }
        }
      }
    }
}

ctx.save()

blueprints.forEach(blueprint => {
  const w = getWidth(blueprint.ground)
  const h = getHeight(blueprint.ground)

  const box = getNextBox(h, w)

  addBox('machine' + blueprint.id, box)

  //

  ctx.save()
  ctx.translate(box[0] * l, box[1] * l)
  ctx.scale(l / offset.s, l / offset.s)

  ctx.beginPath()
  ctx.rect(0, 0, h, w)
  ctx.clip()

  drawMachineHull(blueprint.ground)

  ctx.fillStyle = `hsl(40,80%,${20 + Math.random() * 30}%)`
  ctx.beginPath()
  ctx.fillRect(0, 0, 9, 9)

  for (let k = 100; k--; ) {
    ctx.fillStyle = `hsl(40,80%,${20 + Math.random() * 30}%)`

    const size = k > 50 ? 1 : 1 / 4
    const x = Math.round((Math.random() * (h + size) - size) * 4) / 4
    const y = Math.round((Math.random() * (w + size) - size) * 4) / 4

    ctx.beginPath()
    ctx.fillRect(x, y, size, size)
  }

  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(buffer, 0, 0, h * 100, w * 100, 0, 0, h, w)

  //
  ctx.restore()
})

ctx.restore()
