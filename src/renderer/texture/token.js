import { plank_light, plank_mid } from '~/config/palette'

export const texture_grainRice = document.createElement('canvas')
const l = (texture_grainRice.width = texture_grainRice.height = 256)
const ctx = texture_grainRice.getContext('2d')

texture_grainRice.style.cssText =
  'border:solid 1px #000;z-index:10;top:10px;left:10px;position:absolute'

window.document.body.appendChild(texture_grainRice)

ctx.fillStyle = '#fff'
ctx.scale(l / 100, l / 100)
ctx.fillRect(0, 0, 100, 100)

ctx.fillStyle = plank_light
ctx.moveTo()
