import { distanceSq, pointToCell, pointEqual } from '~/service/point'
import { findPath } from '~/service/aStar'
import {
  getWidth,
  getHeight,
  getCell,
  isNavigable,
  isContructible,
  setCell,
} from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import type { ID, UIstate, Universe, Machine, Cell, Point } from '~/type'

export const onpointermove = (universe: Universe, uistate: UIstate) => (
  pointer: Point,
  cell: Cell
) => {
  const m = uistate.dragMachine

  if (!m) return

  //
  // place machine
  m.positionOrigin.x = cell.x
  m.positionOrigin.y = cell.y

  const w = getWidth(m.blueprint.ground)
  const h = getHeight(m.blueprint.ground)

  const a = projMachine(m)({ x: 0, y: 0 })
  const b = projMachine(m)({ x: w - 1, y: h - 1 })

  const t = {
    x: Math.min(a.x, b.x) + Math.floor(w / 2),
    y: Math.min(a.y, b.y) + Math.floor(w / 2),
  }

  m.positionOrigin.x += cell.x - t.x
  m.positionOrigin.y += cell.y - t.y

  //
  // check if the position is suitable
  const p = projMachine(m)
  uistate.dragMachineDroppable = true

  for (let x = w; x--; )
    for (let y = h; y--; ) {
      const u = { x, y }

      uistate.dragMachineDroppable =
        uistate.dragMachineDroppable &&
        (isNavigable(m.blueprint.ground, u) ||
          isContructible(universe.map, p(u)))
    }

  uistate.dragMachineDroppable =
    uistate.dragMachineDroppable &&
    [...m.blueprint.outputs, ...m.blueprint.inputs].every(({ cell }) =>
      isContructible(universe.map, p(cell))
    )
}

export const onpointerup = (universe: Universe, uistate: UIstate) => (
  pointer: Point,
  cell: Cell
) => {
  if (!uistate.dragMachine) return

  if (!uistate.dragMachineDroppable) {
    uistate.dragMachine = null
    return
  }

  const m = uistate.dragMachine

  universe.bank -= m.blueprint.buildingCost

  const p = projMachine(m)

  const w = getWidth(m.blueprint.ground)
  const h = getHeight(m.blueprint.ground)

  for (let x = w; x--; )
    for (let y = h; y--; )
      if (!isNavigable(m.blueprint.ground, { x, y }))
        setCell(universe.map, p({ x, y }), 3)

        //
  ;[...m.blueprint.outputs, ...m.blueprint.inputs].every(({ cell }) =>
    setCell(universe.map, p(cell), 2)
  )

  // push new machine
  universe.machines.push(m)

  // reset
  uistate.dragMachine = null

  // reset bots path
  universe.bots.forEach(
    // bot => bot.navigation && (bot.navigation.pathToTarget = null)
    bot => (bot.navigation = null)
  )
}
