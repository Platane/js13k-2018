import {
  black,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
} from '~/config/palette'

export const texture = document.createElement('canvas')
const l = (texture.width = texture.height = 512)
const ctx = texture.getContext('2d')

texture.style.cssText =
  'border:solid 1px #000;z-index:10;top:10px;left:10px;position:absolute'

window.document.body.appendChild(texture)

Array.from({ length: 800 }).forEach(() => {
  ctx.fillStyle = `hsl(${Math.random() * 360},80%,60%)`
  ctx.beginPath()
  ctx.arc(Math.random() * l, Math.random() * l, 20, 0, Math.PI * 2)
  ctx.fill()
})

ctx.fillStyle = '#fff'
ctx.scale(l / 100 / 4, l / 100 / 4)

//
ctx.fillStyle = black
ctx.beginPath()
ctx.arc(50, 50, 45, 0, Math.PI * 2)
ctx.fill()
ctx.fillStyle = plank_light
ctx.beginPath()
ctx.arc(50, 50, 40, 0, Math.PI * 2)
ctx.fill()

//
ctx.translate(100, 0)
ctx.fillStyle = black
ctx.beginPath()
ctx.arc(50, 50, 45, 0, Math.PI * 2)
ctx.fill()
ctx.fillStyle = plank_mid
ctx.beginPath()
ctx.arc(50, 50, 40, 0, Math.PI * 2)
ctx.fill()

//
ctx.translate(100, 0)
ctx.fillStyle = black
ctx.beginPath()
ctx.arc(50, 50, 45, 0, Math.PI * 2)
ctx.fill()
ctx.fillStyle = salmon_orange
ctx.beginPath()
ctx.arc(50, 50, 40, 0, Math.PI * 2)
ctx.fill()

//
ctx.translate(100, 0)
ctx.fillStyle = black
ctx.beginPath()
ctx.arc(50, 50, 45, 0, Math.PI * 2)
ctx.fill()
ctx.fillStyle = salmon_pink
ctx.beginPath()
ctx.arc(50, 50, 40, 0, Math.PI * 2)
ctx.fill()
