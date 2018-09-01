import { proj } from '~/service/machine'
import { rayCastCheck, isNavigable } from '~/service/map'
import { pointToCell, pointEqual, distance } from '~/service/point'
import { BOT_ACTIVATION_DELAY } from '~/config'
import type { Universe, BotActivate } from '~/type'

export const botActivatorDecision = (
  { machines }: Universe,
  bot: BotActivate
) => {
  //
  const machine = machines.find(({ id }) => id === bot.command.targetId)

  if (!machine) return

  const activationCell = proj(machine)(machine.blueprint.outputs[0].cell)

  const activationPoint = {
    x: activationCell.x + 0.5,
    y: activationCell.y + 0.5,
  }

  const d = distance(activationPoint, bot.position)

  // approch the machine if it process something, and you can activate it
  if (
    (!bot.navigation &&
      (bot.activity.activationCooldown < 5 && machine.processing)) ||
    d > 1.8
  ) {
    bot.navigation = {
      target: activationPoint,
    }
  }

  // do not approch the machine if it's not processing
  if (bot.navigation && !machine.processing && d < 1.8) {
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
    bot.activity.activationCooldown = BOT_ACTIVATION_DELAY
  } else {
    bot.activity.activationCooldown--
  }
}
