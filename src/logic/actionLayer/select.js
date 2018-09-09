import { distanceSq, pointToCell, pointEqual } from '~/service/point'
import { findPath } from '~/service/aStar'
import { isNavigable, getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import type { ID, UIstate, Universe, Machine, Cell, Point } from '~/type'

export const onpointerdown = (universe: Universe, uistate: UIstate) => (
  pointer: Point,
  cell: Cell
) => {
  if (uistate.command) return

  const bot = universe.bots.find(
    ({ position }) => distanceSq(position, pointer) < 0.5 * 0.5
  )

  const botId = bot ? bot.id : null

  if (uistate.selectedBotId !== botId) {
    uistate.selectedBotId = botId

    // if ( botId ){
    //   uistate.command = {}
    // }
  }
}
