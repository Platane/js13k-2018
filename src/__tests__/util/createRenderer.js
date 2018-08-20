import { draw } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import type { Camera, Universe } from '~/type'

const placeholder = () => ({
  update: (u: Universe) => 0,
  destroy: () => 0,
  camera: { a: 1, t: { x: 0, y: 0 } },
})

const dom = () => {
  const parent: any = document.getElementById('app') || document.body

  const canvas = document.createElement('canvas')

  canvas.style.position = 'absolute'
  canvas.style.left = '0px'
  canvas.style.top = '0px'

  parent.appendChild(canvas)

  const camera: Camera = { a: 1, t: { x: 0, y: 0 } }

  const update = (universe: Universe) => {
    let { width, height } = parent.getBoundingClientRect()

    canvas.height = height
    canvas.width = width

    camera.a = Math.min(
      width / getWidth(universe.map),
      height / getHeight(universe.map)
    )

    draw(canvas.getContext('2d'), camera, universe)
  }

  const destroy = () =>
    canvas.parentNode && canvas.parentNode.removeChild(canvas)

  return { destroy, update, camera }
}

export const createRenderer =
  typeof document === 'undefined' ? placeholder : dom
