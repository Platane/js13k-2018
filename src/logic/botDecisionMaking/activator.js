import { proj, getClosestPointToMachine } from '~/service/machine'
import { pointToCell, pointEqual, distance } from '~/service/point'
import { rayCastCheck, isNavigable } from '~/service/map'
import { BOT_ACTIVATION_DELAY, BOT_ACTIVATION_TOUCH } from '~/config'
import type { Universe, BotActivate } from '~/type'

export const botActivatorDecision = (
  { map, machines }: Universe,
  bot: BotActivate
) => {
  //
  const machine = machines.find(({ id }) => id === bot.command.targetId)

  if (!machine) return

  //
  // refresh the navigation
  if (bot.command.targetCooldown) bot.command.targetCooldown--

  if (bot.command.targetCooldown <= 0) bot.navigation = null

  //
  // touch the machine, or not
  const shoulTouchMachine =
    bot.activity.activationCooldown < BOT_ACTIVATION_TOUCH

  if (shoulTouchMachine && !bot.navigation) {
    const activationPoint = getClosestPointToMachine(map, machine, bot.position)

    if (!activationPoint) {
      bot.command.type = 'idle'
      return
    }

    bot.navigation = { target: activationPoint }
    bot.command.targetCooldown = 120
  }

  if (!shoulTouchMachine && bot.navigation) bot.navigation = null

  //
  // activate
  if (
    bot.activity.activationCooldown <= 0 &&
    machine.processing &&
    !machine.processing.activated
  ) {
    const activationPoint = getClosestPointToMachine(map, machine, bot.position)

    if (!activationPoint) {
      bot.command.type = 'idle'
      return
    }

    const d = distance(activationPoint, bot.position)

    if (d < 0.23) {
      bot.navigation = null
      machine.processing.activated = true
      bot.activity.activationCooldown = BOT_ACTIVATION_DELAY
    }
  }

  bot.activity.activationCooldown--
}
