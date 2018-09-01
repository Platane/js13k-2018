import { unproj } from '~/service/camera'
import { distanceSq, pointToCell, pointEqual } from '~/service/point'
import { findPath } from '~/service/aStar'
import { isNavigable, getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { getPointer } from '~/util/pointer'
import type { ID, UIstate, Camera, Universe, Machine, Cell } from '~/type'
const handlers = [
  //
  require('./select'),
  require('./placeMachine'),
  require('./command'),
]

export const createActionLayer = (
  element: Element,
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => {
  const handler = handlers => (event: MouseEvent | TouchEvent) => {
    const pointer = unproj(camera)(getPointer(event))

    const cell = pointToCell(pointer)

    handlers
      .filter(Boolean)
      .forEach(h => h(universe, uistate, camera)(pointer, cell, event))
  }

  const onmove = (e: MouseEvent) => {
    const pointer = unproj(camera)({ x: e.clientX, y: e.clientY })

    const cell = pointToCell(pointer)
  }

  const onpointerdown = handler(handlers.map(x => x.onpointerdown))
  element.onmousedown = element.ontouchstart = e => {
    onpointerdown(e)
    element.onmousemove(e)
  }
  element.onmousemove = element.ontouchmove = handler(
    handlers.map(x => x.onpointermove)
  )
  element.onmouseup = element.ontouchend = handler(
    handlers.map(x => x.onpointerup)
  )

  // disable context menu
  // element.addEventListener('contextmenu', e => {
  //   e.preventDefault()
  //   e.stopPropagation()
  // })
}
