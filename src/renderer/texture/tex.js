import {
  black,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
} from '~/config/palette'

export const texture = document.createElement('canvas')
export const l = (texture.width = texture.height = 1024)
export const ctx = texture.getContext('2d')

// window.document.body.appendChild(texture)
// texture.style.cssText =
//   'border:solid 3px red;z-index:10;top:10px;left:10px;position:absolute'

export const offset = { x: 0, y: 0, h: 0, s: 10 }
export const getNextBox = (w: number, h: number) => {
  if (offset.x + w > offset.s) {
    offset.x = 0
    offset.y += offset.h
    offset.h = 0
  }

  const box = [
    offset.x / offset.s,
    offset.y / offset.s,
    w / offset.s,
    h / offset.s,
  ]

  offset.h = Math.max(offset.h, h)
  offset.x += w

  // ctx.save()
  // ctx.strokeStyle = 'red'
  // ctx.lineWidth = 5
  // ctx.strokeRect(box[0] * l, box[1] * l, box[2] * l, box[3] * l)
  // ctx.restore()

  return box
}

type Boxes = {
  ['bot' | 'wall' | 'sushi' | 'blue' | 'yello' | 'purple' | string]: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ],
}
export const boxes: Boxes = {}

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

  const m = outline + 4

  ctx.scale(
    (boxDestination[2] * l) / (box[2] + m),
    (boxDestination[3] * l) / (box[3] + m)
  )

  ctx.translate(m / 2, m / 2)

  ctx.strokeStyle = black
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = outline
  paths.forEach(p => ctx.stroke(new Path2D(p)))

  ctx.lineWidth = 0.8
  paths.forEach((p, i) => {
    ctx.strokeStyle = ctx.fillStyle = colors[i]
    ctx.fill(new Path2D(p))
    ctx.stroke(new Path2D(p))
  })

  ctx.restore()
}

export const boxToBox = ([x, y, w, h]: [number, number, number, number]) =>
  // prettier-ignore
  [
    x,y,
    x+w,y,
    x+w,y+h,
    x,y+h
  ]

export const addBox = (label: string, x: [number, number, number, number]) =>
  (boxes[label] = boxToBox(x))
