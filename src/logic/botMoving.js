import { around8 as around } from '~/service/map'
import { normalize, length } from '~/service/point'
import { SOLID_FRICTION, WALKING_POWER } from '~/config/physic'
import type { Universe } from '~/type'

const EPSYLON = 0.0001

const round = x => Math.round(x * 10000) / 10000

export const botMoving = ({ map, bots }: Universe) => {
  const acc = bots.map(({ velocity, position, command, activity }) => {
    // compute the acceleration, as sum of every forces
    const a = { x: 0, y: 0 }

    // solid friction
    a.x += -SOLID_FRICTION * velocity.x
    a.y += -SOLID_FRICTION * velocity.y

    // go to target
    if (activity && activity.nextCell) {
      const d = {
        x: activity.nextCell.x - position.x,
        y: activity.nextCell.y - position.y,
      }

      const l = length(d)

      if (l > EPSYLON) {
        a.x += (d.x / l) * WALKING_POWER
        a.y += (d.y / l) * WALKING_POWER
      }
    }

    return a
  })

  // apply delta t
  bots.forEach((bot, i) => {
    bot.velocity.x += acc[i].x
    bot.velocity.y += acc[i].y

    bot.position.x += bot.velocity.x
    bot.position.y += bot.velocity.y

    bot.position.x = round(bot.position.x)
    bot.position.y = round(bot.position.y)
  })
}
