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

export const onpointerdown = (
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => (pointer: Point, cell: Cell) => {
  const bot = universe.bots.find(
    ({ position }) => distanceSq(position, pointer) < 0.5 * 0.5
  )

  const botId = bot ? bot.id : null

  if (uistate.selectedBotId !== botId) {
    uistate.selectedBotId = botId
    uistate.pickUpCell = null
  }
}
