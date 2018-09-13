import { plank_light, plank_mid } from '~/config/palette'
import { cellCenter } from '~/service/point'
import {
  getCell,
  around4,
  around8,
  isInside,
  getWidth,
  getHeight,
  isNavigable,
  isContructible,
} from '~/service/map'
import { l, texture, boxes, offset, ctx, getNextBox, addBox } from './tex'
import { blueprints } from '~/config/blueprints'
import { proj } from '~/service/machine'
import {
  texture_arrow_ouput_box,
  texture_arrow_input_box,
} from '~/renderer/texture/svg/arrow'

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
      ctxbuffer.fillStyle = !isNavigable(ground, { x, y }) ? '#000' : '#0000'

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

blueprints.forEach((blueprint, i) => {
  const w = getWidth(blueprint.ground)
  const h = getHeight(blueprint.ground)

  const box = getNextBox(h, w)

  addBox(blueprint.id, box)

  //

  ctx.save()
  ctx.translate(box[0] * l, box[1] * l)
  ctx.scale(l / offset.s, l / offset.s)

  ctx.beginPath()
  ctx.rect(0, 0, h, w)
  ctx.clip()

  drawMachineHull(blueprint.ground)

  ctx.fillStyle = `hsl(${20 + i * 18},30%,${20 + Math.random() * 20}%)`
  ctx.beginPath()
  ctx.fillRect(0, 0, 9, 9)

  for (let k = 100; k--; ) {
    ctx.fillStyle = `hsl(${20 + i * 18},30%,${20 + Math.random() * 20}%)`

    const size = k > 50 ? 1 : 1 / 4
    const x = Math.round((Math.random() * (h + size) - size) * 4) / 4
    const y = Math.round((Math.random() * (w + size) - size) * 4) / 4

    ctx.beginPath()
    ctx.fillRect(x, y, size, size)
  }

  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(buffer, 0, 0, h * 100, w * 100, 0, 0, h, w)

  ctx.globalCompositeOperation = 'source-over'

  // draw inputs / outputs

  const s = 0.45
  const t = 0.3

  blueprint.outputs.forEach(({ cell }) => {
    const k =
      around4.findIndex(v => {
        const o = { x: v.x + cell.x, y: v.y + cell.y }

        return (
          isInside(blueprint.ground, o) && !isNavigable(blueprint.ground, o)
        )
      }) || 0

    const b = texture_arrow_ouput_box

    ctx.save()
    ctx.translate(
      cell.y + 0.5 + around4[(k + 3) % 4].x * t,
      cell.x + 0.5 + around4[(k + 3) % 4].y * t
    )
    ctx.rotate(((k + 3) * Math.PI) / 2)
    ctx.drawImage(
      texture,

      b[0] * l,
      b[1] * l,
      (b[2] - b[0]) * l,
      (b[5] - b[1]) * l,

      -s / 2,
      -s / 2,
      s,
      s
    )
    ctx.restore()
  })

  blueprint.inputs.forEach(({ cell }) => {
    const k =
      around4.findIndex(v => {
        const o = { x: v.x + cell.x, y: v.y + cell.y }

        return (
          isInside(blueprint.ground, o) && !isNavigable(blueprint.ground, o)
        )
      }) || 0

    const b = texture_arrow_input_box

    ctx.save()
    ctx.translate(
      cell.y + 0.5 + around4[(k + 1) % 4].x * t,
      cell.x + 0.5 + around4[(k + 1) % 4].y * t
    )
    ctx.rotate(((k + 1) * Math.PI) / 2)
    ctx.drawImage(
      texture,

      b[0] * l,
      b[1] * l,
      (b[2] - b[0]) * l,
      (b[5] - b[1]) * l,

      -s / 2,
      -s / 2,
      s,
      s
    )
    ctx.restore()
  })

  // draw token

  const b = boxes[blueprint.recipe.outputs[0].token]

  for (let x = w; x--; )
    for (let y = h; y--; )
      if (getCell(blueprint.ground, { x, y }) == 3) {
        const c = cellCenter({ x, y })

        const tl = 0.4

        ctx.beginPath()
        ctx.fillStyle = '#fff6'
        ctx.arc(c.y, c.x, 0.32, 0, Math.PI * 2)
        ctx.fill()
        ctx.filter = 'grayscale(90%)'
        ctx.drawImage(
          texture,

          b[0] * l,
          b[1] * l,
          (b[2] - b[0]) * l,
          (b[5] - b[1]) * l,

          c.y - tl / 2,
          c.x - tl / 2,
          tl,
          tl
        )
      }

  //
  ctx.restore()
})

ctx.restore()
