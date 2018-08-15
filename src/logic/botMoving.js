import { normalize, length, pointToCell } from '~/service/point'
import { around8, isNavigable } from '~/service/map'
import {
  SOLID_FRICTION,
  WALKING_POWER,
  NEIGHBOR_POWER,
  WALL_PUSH_POWER,
} from '~/config/physic'
import type { Universe } from '~/type'

const EPSYLON = 0.0001

const round = x => Math.round(x * 10000) / 10000

export const botMoving = ({ map, bots }: Universe) => {
  const acc = bots.map(({ velocity, position, command, activity }, i) => {
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

    // pushed from the others
    bots.forEach(b => {
      if (position !== b.position) {
        const d = {
          x: b.position.x - position.x,
          y: b.position.y - position.y,
        }

        const l = Math.max(length(d), 0.01)

        a.x -= (d.x / l / l) * NEIGHBOR_POWER
        a.y -= (d.y / l / l) * NEIGHBOR_POWER
      }
    })

    const cell = pointToCell(position)

    // pushed by walls
    around8.forEach(v => {
      const b = {
        x: cell.x + v.x,
        y: cell.y + v.y,
      }

      if (!isNavigable(map, b)) {
        const c = {
          x: b.x + 0.5 - v.x * 0.5,
          y: b.y + 0.5 - v.y * 0.5,
        }

        const d = {
          x: c.x - position.x,
          y: c.y - position.y,
        }

        let l = v.x * v.y === 0 ? d.x * v.x + d.y * v.y : length(d)

        l = Math.max(l, 0.01)

        // a.x -= (v.x / l) * WALL_PUSH_POWER
        // a.y -= (v.y / l) * WALL_PUSH_POWER

        a.x -= (d.x / l / l) * WALL_PUSH_POWER
        a.y -= (d.y / l / l) * WALL_PUSH_POWER
      }
    })

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
