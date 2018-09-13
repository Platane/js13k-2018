import { plank_light, plank_mid } from '~/config/palette'
import { l, offset, ctx, getNextBox, addBox } from './tex'

// export const texture = document.createElement('canvas')
// texture.height = 64
// texture.width = 264
//
// const s = 8
//
// window.document.body.appendChild(texture)
// texture.style.cssText =
//   'border:solid 3px red;z-index:10;top:10px;left:10px;position:absolute;background-color:yellow'
//
// const ctx = texture.getContext('2d')
//
// ctx.scale(s, s)
//
// for (let y = texture.height / s; y--; ) {
//   let x = 0
//
//   while (x <= texture.width / s) {
//     const l = Math.ceil(3 + Math.random() * 6)
//
//     const k = Math.floor(Math.random() * 4) / 4
//     ctx.fillStyle = `hsl(40,40%,${20 + k * 30}%)`
//
//     ctx.beginPath()
//     ctx.fillRect(x, y, l, 1)
//
//     x += l
//   }
// }

export const fw = 8
export const fh = 3
export const box = getNextBox(fw, fh)

addBox('floor', box)

ctx.save()
ctx.scale(l / offset.s, l / offset.s)
ctx.translate(box[0] * offset.s, box[1] * offset.s)

ctx.beginPath()
const EPSYLON = 0.01
ctx.rect(
  -EPSYLON,
  -EPSYLON,
  box[2] * offset.s + EPSYLON * 2,
  box[3] * offset.s + EPSYLON * 2
)
ctx.clip()

const s = 1 / 4

ctx.scale(s, s)

let y = 0
let x = 0
while (y < fh / s) {
  x = 0

  while (x < fw / s) {
    const pl = Math.ceil(3 + Math.random() * 6)

    const k = Math.floor(Math.random() * 4) / 4
    ctx.strokeStyle = ctx.fillStyle = `hsl(40,30%,${53 + k * 8}%)`
    ctx.lineWidth = 0.1
    ctx.beginPath()
    ctx.fillRect(x, y, pl, 1)
    ctx.strokeRect(x, y, pl, 1)

    x += pl
  }

  const pl = Math.ceil(1 + Math.random() * 2)

  ctx.beginPath()
  ctx.fillRect(0, y, pl, 1)
  ctx.strokeRect(0, y, pl, 1)

  y++
}

ctx.restore()
