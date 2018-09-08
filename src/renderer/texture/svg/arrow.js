import { texture, ctx, l, drawPaths, addBox, getNextBox, offset } from '../tex'
import {
  black,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
  blue_true,
  blue_light,
  blue_dark,
} from '~/config/palette'

const smoothArrow = () => {
  ctx.beginPath()
  ctx.arc(50, 50, 28, 0, Math.PI * 2)
  ctx.moveTo(22.5, 42)
  ctx.lineTo(50, 5)
  ctx.lineTo(77.5, 42)
  ctx.fill()
}

const rectArrow = () => {
  ctx.beginPath()
  ctx.fillRect(27, 27, 46, 46)
  ctx.moveTo(5, 45)
  ctx.lineTo(50, 3)
  ctx.lineTo(95, 45)
  ctx.fill()
}

let box

box = getNextBox(1, 1)
ctx.save()
ctx.scale(l / (100 * offset.s), l / (100 * offset.s))
ctx.translate(box[0] * 100 * offset.s, box[1] * 100 * offset.s)
addBox('arrow', box)
ctx.fillStyle = blue_true
smoothArrow()
ctx.restore()

box = getNextBox(1, 1)
ctx.save()
ctx.scale(l / (100 * offset.s), l / (100 * offset.s))
ctx.translate(box[0] * 100 * offset.s, box[1] * 100 * offset.s)
addBox('arrow_selected', box)
ctx.fillStyle = salmon_pink
smoothArrow()
ctx.restore()

box = getNextBox(1, 1)
ctx.save()
ctx.scale(l / (100 * offset.s), l / (100 * offset.s))
ctx.translate(box[0] * 100 * offset.s, box[1] * 100 * offset.s)
addBox('arrow_input', box)
ctx.fillStyle = salmon_pink
rectArrow()
ctx.restore()

box = getNextBox(1, 1)
ctx.save()
ctx.scale(l / (100 * offset.s), l / (100 * offset.s))
ctx.translate(box[0] * 100 * offset.s, box[1] * 100 * offset.s)
addBox('arrow_output', box)
ctx.fillStyle = plank_mid
rectArrow()
ctx.restore()

box = getNextBox(1, 1)
ctx.save()
ctx.scale(l / (100 * offset.s), l / (100 * offset.s))
ctx.translate(box[0] * 100 * offset.s, box[1] * 100 * offset.s)
addBox('arrow_client', box)
ctx.fillStyle = blue_dark
rectArrow()
ctx.restore()
