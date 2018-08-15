import { rayCastCheck, isNavigable } from '~/service/map'
import { pointToCell, pointEqual, distanceSq } from '~/service/point'
import type { Universe, BotCarry } from '~/type'

export const botCarrierDecision = (universe: Universe, bot: BotCarry) => {
  //

  // try to pick up things
  if (
    !bot.activity.carrying &&
    pointEqual(bot.command.pickUpCell, pointToCell(bot.position))
  ) {
    // check the list of dropped tokens
    const i = universe.droppedTokens.findIndex(x =>
      pointEqual(pointToCell(x.position), pointToCell(bot.position))
    )

    if (i >= 0) {
      const [{ token }] = universe.droppedTokens.splice(i, 1)

      bot.activity.carrying = token

      bot.activity.path.reverse()
    }
  }

  // try to drop things
  if (
    bot.activity.carrying &&
    distanceSq(bot.position, {
      x: bot.command.dropCell.x + 0.5,
      y: bot.command.dropCell.y + 0.5,
    }) <
      0.3 * 0.3
  ) {
    const token = bot.activity.carrying

    universe.droppedTokens.push({ token, position: { ...bot.position } })

    bot.activity.carrying = null

    bot.activity.path.reverse()
  }

  const isReachable = ({ x, y }) =>
    rayCastCheck(c => isNavigable(universe.map, c), bot.position, {
      x: x + 0.5,
      y: y + 0.5,
    })

  const nextCell =
    bot.activity.path.reduceRight((t, c) => t || (isReachable(c) && c), null) ||
    bot.activity.path[0]

  bot.activity.nextCell.x = nextCell.x + 0.5
  bot.activity.nextCell.y = nextCell.y + 0.5
}
