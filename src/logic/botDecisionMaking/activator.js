import { proj } from '~/service/machine'
import { rayCastCheck, isNavigable } from '~/service/map'
import { pointToCell, pointEqual, distanceSq } from '~/service/point'
import type { Universe, BotActivate } from '~/type'

export const botActivatorDecision = (
  { machines }: Universe,
  bot: BotActivate
) => {
  //
  const machine = machines.find(({ id }) => id === bot.command.targetId)

  if (!machine) return

  const activationCell = proj(machine)(machine.blueprint.outputs[0].cell)

  // approch the machine if it process something, and you can activate it
  if (
    !bot.navigation &&
    bot.activity.activationCooldown < 5 &&
    machine.processing
  ) {
    bot.navigation = {
      target: {
        x: activationCell.x + 0.5,
        y: activationCell.y + 0.5,
      },
    }
  }

  // do not approch the machine if it's not processing
  if (bot.navigation && !machine.processing) {
    bot.navigation = null
  }

  // activate
  if (
    bot.activity.activationCooldown <= 0 &&
    machine.processing &&
    !machine.processing.activated &&
    pointEqual(activationCell, pointToCell(bot.position))
  ) {
    bot.navigation = null
    machine.processing.activated = true
    bot.activity.activationCooldown = 50
  } else {
    bot.activity.activationCooldown--
  }
}
