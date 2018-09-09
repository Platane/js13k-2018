import { rayCastCheck, isNavigable } from '~/service/map'
import { pointToCell, pointEqual, distanceSq } from '~/service/point'
import { DROPPED_DELAY } from '~/config'
import type { Universe, BotWander } from '~/type'

export const botWandererDecision = (
  { customers }: Universe,
  client: BotWander
) => {
  //

  if (!client.activity || client.activity.cooldown < 0) {
    const { cell } = customers[Math.floor(Math.random() * customers.length)]

    const target = {
      x: cell.x + Math.random(),
      y: cell.y + Math.random(),
    }

    client.command.target = target

    client.navigation = { target }

    client.activity = { cooldown: 20 + Math.random() * 50 }
  } else client.activity.cooldown--
}
