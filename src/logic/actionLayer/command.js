import { unproj } from '~/service/camera'
import { distanceSq, pointToCell, pointEqual } from '~/service/point'
import { findPath } from '~/service/aStar'
import { isNavigable, getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import type {
  ID,
  UIstate,
  Camera,
  Universe,
  Machine,
  Cell,
  Point,
} from '~/type'

const isMachineHit = (m: Machine, cell: Cell) => {
  const blueprint = m.blueprint

  for (let x = getWidth(blueprint.ground); x--; )
    for (let y = getHeight(blueprint.ground); y--; )
      if (
        !isNavigable(blueprint.ground, { x, y }) &&
        pointEqual(cell, projMachine(m)({ x, y }))
      )
        return true

  return false
}

export const onclick = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (e: MouseEvent, pointer: Point, cell: Cell) => {}

export const onpointermove = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (e: MouseEvent, pointer: Point, cell: Cell) => {}

export const onpointerdown = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (e: MouseEvent, pointer: Point, cell: Cell) => {}

export const onpointerup = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (e: MouseEvent, pointer: Point, cell: Cell) => {}

export const createActionLayer = (
  element: Element,
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => {
  const onclick = (e: MouseEvent) => {
    const pointer = unproj(camera)({ x: e.clientX, y: e.clientY })

    const cell = pointToCell(pointer)

    if (e.button === 0) {
      const bot = universe.bots.find(
        ({ position }) => distanceSq(position, pointer) < 0.5 * 0.5
      )

      const botId = bot ? bot.id : null

      if (uistate.selectedBotId !== botId) {
        uistate.selectedBotId = botId
        uistate.pickUpCell = null
      }
    }

    const bot = universe.bots.find(({ id }) => id === uistate.selectedBotId)

    if (e.button === 2 && bot) {
      if (uistate.pickUpCell) {
        // compute path
        const path = findPath(universe.map, uistate.pickUpCell, cell)

        if (!path) window.alert('this cell can not be reached')
        else {
          if (bot.activity && bot.activity.carrying) {
            // drop to the ground
          }

          bot.command = {
            type: 'carry',
            dropCell: cell,
            pickUpCell: uistate.pickUpCell,
          }

          bot.activity = {
            carrying: null,
          }

          // reset uistate
          uistate.pickUpCell = null
        }

        return
      }

      // click on a machine
      if (!isNavigable(universe.map, cell)) {
        const machine = universe.machines.find(m => isMachineHit(m, cell))

        if (machine) {
          bot.command = {
            type: 'activate',
            targetId: machine.id,
          }
          bot.activity = { activationCooldown: 0 }
        }
      }

      uistate.pickUpCell = cell
      //
    }
  }

  const onmove = (e: MouseEvent) => {
    const pointer = unproj(camera)({ x: e.clientX, y: e.clientY })

    const cell = pointToCell(pointer)
  }

  element.addEventListener('mousedown', onclick)
  element.addEventListener('mousemove', onmove)

  // disable context menu
  element.addEventListener('contextmenu', e => {
    e.preventDefault()
    e.stopPropagation()
  })
}
