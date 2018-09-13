import {
  texture,
  ctx,
  l,
  drawPaths,
  boxToBox,
  getNextBox,
  offset,
} from '../tex'
import {
  black,
  white,
  plank_light,
  grey_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
  blue_true,
  blue_light,
  blue_dark,
  gold,
} from '~/config/palette'

const smoothArrow = () => {
  ctx.beginPath()
  ctx.arc(50, 50, 28, 0, Math.PI * 2)
  ctx.moveTo(22.5, 42)
  ctx.lineTo(50, 5)
  ctx.lineTo(77.5, 42)
  ctx.fill()
}

let box

const prep = w => {
  box = getNextBox(w, w)
  ctx.save()
  ctx.scale(l / (100 * offset.s), l / (100 * offset.s))
  ctx.translate(box[0] * 100 * offset.s, box[1] * 100 * offset.s)
  ctx.fillStyle = grey_light
  return boxToBox(box)
}

export const texture_arrow_idle_box = prep(1)
ctx.fillStyle = grey_light
ctx.beginPath()
ctx.arc(50, 50, 28, 0, Math.PI * 2)
ctx.fill()
ctx.restore()

export const texture_circle_box = prep(1)
box = getNextBox(1, 1)
ctx.fillStyle = white
ctx.beginPath()
ctx.arc(50, 50, 30, 0, Math.PI * 2)
ctx.fill()
ctx.restore()

export const texture_arrow_box = prep(1)
ctx.fillStyle = grey_light
smoothArrow()
ctx.restore()

export const texture_arrow_output_box = prep(1)
ctx.fillStyle = grey_light
ctx.beginPath()
ctx.fillRect(27, 27, 46, 46)
ctx.moveTo(5, 45)
ctx.lineTo(50, 3)
ctx.lineTo(95, 45)
ctx.fill()
ctx.restore()

export const texture_black_box = prep(0.3)
ctx.fillStyle = black
ctx.fillRect(0, 0, 30, 30)
ctx.restore()

export const texture_red_box = prep(0.3)
ctx.fillStyle = blue_true
ctx.fillRect(0, 0, 30, 30)
ctx.restore()

export const texture_arrow_selected_box = prep(1.4)
ctx.scale(1.4, 1.4)
ctx.fillStyle = blue_true
smoothArrow()
ctx.restore()
