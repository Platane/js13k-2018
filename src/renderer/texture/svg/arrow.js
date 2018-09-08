import { texture, ctx, l, drawPaths, addBox } from '../tex'
import {
  black,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
  blue_true,
  blue_light,
} from '~/config/palette'

ctx.save()

ctx.translate(0, l / 2)
ctx.scale(l / 400, l / 400)

ctx.beginPath()
ctx.arc(50, 50, 28, 0, Math.PI * 2)
ctx.fillStyle = blue_true
ctx.moveTo(22.5, 42)
ctx.lineTo(50, 5)
ctx.lineTo(77.5, 42)
ctx.fill()

ctx.translate(100, 0)

ctx.beginPath()
ctx.arc(50, 50, 28, 0, Math.PI * 2)
ctx.fillStyle = salmon_pink
ctx.moveTo(22.5, 42)
ctx.lineTo(50, 5)
ctx.lineTo(77.5, 42)
ctx.fill()

ctx.restore()

addBox('arrow', [0, 2 / 4, 1 / 4, 1 / 4])
addBox('arrow_selected', [1 / 4, 2 / 4, 1 / 4, 1 / 4])
