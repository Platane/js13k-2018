import {
  black,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
} from '~/config/palette'

export const texture = document.createElement('canvas')
export const l = (texture.width = texture.height = 512)
export const ctx = texture.getContext('2d')

texture.style.cssText =
  'border:solid 1px #000;z-index:10;top:10px;left:10px;position:absolute'

window.document.body.appendChild(texture)

ctx.save()

Array.from({ length: 80 }).forEach(() => {
  ctx.fillStyle = `hsl(${Math.random() * 40 + 68},60%,80%)`
  ctx.beginPath()
  ctx.arc(
    l * ((Math.random() * 1) / 4 + 3 / 4),
    l * ((Math.random() * 1) / 4 + 3 / 4),
    l / 8,
    0,
    Math.PI * 2
  )
  ctx.fill()
})

ctx.scale(l / 100 / 4, l / 100 / 4)

//
ctx.translate(100, 0)
ctx.translate(100, 0)

ctx.translate(100, 0)
ctx.fillStyle = black
ctx.beginPath()
ctx.arc(50, 50, 45, 0, Math.PI * 2)
ctx.fill()
ctx.fillStyle = salmon_pink
ctx.beginPath()
ctx.arc(50, 50, 40, 0, Math.PI * 2)
ctx.fill()

export const boxes = {
  // prettier-ignore
  bot: [
    0, 0,
    1 / 4, 0,
    1 / 4, 1 / 4,
    0, 1 / 4,
  ],

  // prettier-ignore
  wall: [
    3 / 4, 3 / 4,
    4 / 4, 3 / 4,
    4 / 4, 4 / 4,
    3 / 4, 4 / 4,
  ]
}

ctx.restore()

export const drawPaths = (
  paths: string[],
  colors: string[],
  // box in the svg unit
  box: [number, number, number, number],
  // considering the canvas is 1x1
  boxDestination: [number, number, number, number],
  // outline
  outline: number = 16
) => {
  ctx.save()

  ctx.translate(boxDestination[0] * l, boxDestination[1] * l)

  ctx.scale(
    (boxDestination[2] * l) / (box[2] + outline),
    (boxDestination[3] * l) / (box[3] + outline)
  )

  ctx.translate(outline / 2, outline / 2)

  ctx.strokeStyle = black
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = outline
  paths.forEach(p => ctx.stroke(new Path2D(p)))
  paths.forEach((p, i) => {
    ctx.fillStyle = colors[i]
    ctx.fill(new Path2D(p))
  })

  ctx.restore()
}

export const addBox = (
  label: string,
  [x, y, w, h]: [number, number, number, number]
) =>
  // prettier-ignore
  boxes[label] = [
    x,y,
    x+w,y,
    x+w,y+h,
    x,y+h
  ]
