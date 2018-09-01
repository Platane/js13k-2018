import { unproj } from '~/service/camera'
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
import { BOT_COST } from '~/config'
import type {
  ID,
  UIstate,
  Camera,
  Universe,
  Machine,
  Cell,
  Point,
} from '~/type'

export const onpointermove = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (pointer: Point, cell: Cell) => {
  const bot = uistate.dragBot

  if (!bot) return

  //
  // place machine
  bot.position.x = cell.x + 0.5
  bot.position.y = cell.y + 0.5

  uistate.dragBotDroppable = isNavigable(universe.map, cell)
}

export const onpointerup = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (pointer: Point, cell: Cell) => {
  if (!uistate.dragBot) return

  if (!uistate.dragBotDroppable) {
    uistate.dragBot = null
    return
  }

  const bot = uistate.dragBot

  universe.bank -= BOT_COST

  // push new machine
  universe.bots.push(bot)

  // reset
  uistate.dragBot = null
  uistate.selectedBotId = bot.id
}
