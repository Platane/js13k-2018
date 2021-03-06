import { proj, getClosestPointToMachine } from '~/service/machine'
import { pointToCell, pointEqual, distance } from '~/service/point'
import { rayCastCheck, isNavigable } from '~/service/map'
import {
  BOT_ACTIVATION_DELAY,
  BOT_ACTIVATION_TOUCH,
  ACTIVATION_DISTANCE,
  MACHINE_ACTIVATION_COOLDOWN,
} from '~/config'
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
  if (bot.activity.navigationCooldown) bot.activity.navigationCooldown--

  if (bot.activity.navigationCooldown <= 0) bot.navigation = null

  //
  // touch the machine, or not
  const shoulTouchMachine =
    bot.activity.activationCooldown < BOT_ACTIVATION_TOUCH

  if (shoulTouchMachine && !bot.navigation) {
    const activationPoint = getClosestPointToMachine(
      map,
      machine,
      bot.position,
      0.02
    )

    if (!activationPoint) {
      bot.command.type = 'idle'
      return
    }

    bot.navigation = { target: activationPoint }
    bot.activity.navigationCooldown = 120
  }

  if (!shoulTouchMachine && bot.navigation) bot.navigation = null

  //
  // activate
  if (
    bot.activity.activationCooldown <= 0 &&
    machine.processing &&
    machine.processing.activationCoolDown <= 0
  ) {
    const activationPoint = getClosestPointToMachine(
      map,
      machine,
      bot.position,
      0.08
    )

    if (!activationPoint) {
      bot.command.type = 'idle'
      return
    }

    const d = distance(activationPoint, bot.position)

    if (d < ACTIVATION_DISTANCE) {
      bot.navigation = null
      machine.processing.k++
      machine.processing.activationCoolDown = MACHINE_ACTIVATION_COOLDOWN
      bot.activity.activationCooldown = BOT_ACTIVATION_DELAY
    }
  }

  bot.activity.activationCooldown--
}
