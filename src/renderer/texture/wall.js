import { plank_light, plank_mid } from '~/config/palette'
import { l, offset, ctx, getNextBox, addBox } from './tex'

ctx.save()
const box = getNextBox(1, 1)
ctx.rect(box[0] * l, box[1] * l, box[2] * l, box[3] * l)
ctx.clip()
Array.from({ length: 80 }).forEach(() => {
  ctx.fillStyle = `hsl(${Math.random() * 40 + 68},60%,80%)`
  ctx.beginPath()
  ctx.arc(
    l * (Math.random() * box[2] + box[0]),
    l * (Math.random() * box[3] + box[1]),
    l / 8,
    0,
    Math.PI * 2
  )
  ctx.fill()
})
ctx.restore()
addBox('wall', box)
