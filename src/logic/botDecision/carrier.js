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
  }

  // ensure the navigation.target is set
  if (
    bot.activity.carrying &&
    (!bot.navigation ||
      !pointEqual(bot.navigation.target, bot.command.dropCell))
  )
    bot.navigation = {
      target: {
        x: bot.command.dropCell.x + 0.5,
        y: bot.command.dropCell.y + 0.5,
      },
    }

  if (
    !bot.activity.carrying &&
    (!bot.navigation ||
      !pointEqual(bot.navigation.target, bot.command.pickUpCell))
  )
    bot.navigation = {
      target: {
        x: bot.command.pickUpCell.x + 0.5,
        y: bot.command.pickUpCell.y + 0.5,
      },
    }
}
