import { distanceSq, pointToCell, pointEqual } from '~/service/point'
import { findPath } from '~/service/aStar'
import { isNavigable, getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { getPointer } from '~/util/pointer'

import * as select from './select'
import * as command from './command'
import * as placeBot from './placeBot'
import * as placeMachine from './placeMachine'

import type { ID, UIstate, Universe, Machine, Cell } from '~/type'
const handlers = [
  //
  select,
  command,
  placeBot,
  placeMachine,
]

export const createActionLayer = (
  element: Element,
  universe: Universe,
  uistate: UIstate
) => {
  let unproj

  const handler = handlers => (event: MouseEvent | TouchEvent) => {
    const pointer = unproj(getPointer(event))

    const cell = pointToCell(pointer)

    handlers
      .filter(Boolean)
      .forEach(h => h(universe, uistate)(pointer, cell, event))
  }

  const resize = () => {
    // map
    const mw = getWidth(universe.map)
    const mh = getHeight(universe.map)

    // screen
    const sw = window.innerWidth
    const sh = window.innerHeight

    const r = Math.min(sw / mw, sh / mh)

    // screen in map coord
    const uw = sw / r
    const uh = sh / r

    unproj = ({ x, y }) => ({
      x: (x / sw) * uw - (uw - mw) / 2,
      y: (y / sh) * uh - (uh - mh) / 2,
    })
  }
  window.addEventListener('resize', resize)

  resize()

  //

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
