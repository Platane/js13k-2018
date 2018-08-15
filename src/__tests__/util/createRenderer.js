import { draw } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import type { Universe } from '~/type'

const placeholder = () => ({ update: (u: Universe) => 0, destroy: () => 0 })

const dom = () => {
  const parent: any = document.body

  const canvas = document.createElement('canvas')

  canvas.style.position = 'absolute'
  canvas.style.left = 0
  canvas.style.top = 0

  parent.appendChild(canvas)

  const update = (universe: Universe) => {
    let { width, height } = parent.getBoundingClientRect()

    canvas.height = height
    canvas.width = width

    const camera = {
      a: Math.min(
        width / getWidth(universe.map),
        height / getHeight(universe.map)
      ),
      t: { x: 0, y: 0 },
    }

    draw(canvas.getContext('2d'), camera, universe)
  }

  const destroy = () =>
    canvas.parentNode && canvas.parentNode.removeChild(canvas)

  return { destroy, update }
}

export const createRenderer =
  typeof document === 'undefined' ? placeholder : dom
