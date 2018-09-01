import { unproj } from '~/service/camera'
import { distanceSq, pointToCell, pointEqual } from '~/service/point'
import { findPath } from '~/service/aStar'
import { isNavigable, getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import type { ID, UIstate, Camera, Universe, Machine, Cell } from '~/type'

const handlers = [
  //
  // require('./command'),
  require('./select'),
  require('./placeMachine'),
]

export const createActionLayer = (
  element: Element,
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => {
  const handler = handlers => (event: MouseEvent | TouchEvent) => {
    const p = {
      x: event.targetTouches ? event.targetTouches[0].clientX : event.clientX,
      y: event.targetTouches ? event.targetTouches[0].clientY : event.clientY,
    }

    const pointer = unproj(camera)(p)

    const cell = pointToCell(pointer)

    handlers
      .filter(Boolean)
      .forEach(h => h(universe, uistate, camera)(pointer, cell, event))
  }

  const onmove = (e: MouseEvent) => {
    const pointer = unproj(camera)({ x: e.clientX, y: e.clientY })

    const cell = pointToCell(pointer)
  }

  element.onmousedown = element.ontouchdown = handler(
    handlers.map(x => x.onpointerdown)
  )
  element.onmousemove = element.ontouchmove = handler(
    handlers.map(x => x.onpointermove)
  )
  element.onmouseup = element.ontouchup = handler(
    handlers.map(x => x.onpointerup)
  )

  // disable context menu
  // element.addEventListener('contextmenu', e => {
  //   e.preventDefault()
  //   e.stopPropagation()
  // })
}
