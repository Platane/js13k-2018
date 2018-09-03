import { unproj } from '~/service/camera'
import { distanceSq, pointToCell, pointEqual } from '~/service/point'
import { findPath } from '~/service/aStar'
import { isNavigable, getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { BOT_ACTIVATION_DELAY, DROPPED_DELAY } from '~/config'
import type {
  ID,
  UIstate,
  Camera,
  Universe,
  Machine,
  Cell,
  Point,
} from '~/type'

export const onpointerdown = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (pointer: Point, cell: Cell) => {
  if (!uistate.command) return

  const machine = universe.machines.find(m => isMachineHit(m, cell))

  if (machine) {
    const bot = universe.bots.find(bot => bot.id === uistate.selectedBotId)

    if (bot.activity && bot.activity.carrying)
      universe.droppedTokens.push({
        availableCoolDown: DROPPED_DELAY,
        token: bot.activity.carrying,
        position: { x: bot.position.x, y: bot.position.y },
      })

    bot.command = {
      type: 'activate',
      targetId: machine.id,
    }
    bot.activity = { activationCooldown: 0 }

    uistate.command = null
  } else if (isNavigable(universe.map, cell)) {
    uistate.command.type = 'carry'
    uistate.command.pickUpCell = cell
  } else {
    uistate.command = null
  }
}

export const onpointermove = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (pointer: Point, cell: Cell) => {
  if (!uistate.command || !uistate.command.pickUpCell) return

  uistate.command.dropCell = cell
}

export const onpointerup = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (pointer: Point, cell: Cell) => {
  if (!uistate.command || !uistate.command.type === 'carry') return

  const path = findPath(
    universe.map,
    uistate.command.pickUpCell,
    uistate.command.dropCell
  )

  if (path) {
    const bot = universe.bots.find(bot => bot.id === uistate.selectedBotId)

    bot.command = {
      type: 'carry',

      dropCell: cell,
      pickUpCell: uistate.command.pickUpCell,
    }

    bot.activity = {
      carrying: bot.activity && bot.activity.carrying,
    }
  }

  uistate.command = null
}

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
