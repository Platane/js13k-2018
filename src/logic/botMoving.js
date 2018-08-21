import { normalize, length, pointToCell } from '~/service/point'
import { around8, isNavigable, rayCastCheck } from '~/service/map'
import { findPath } from '~/service/aStar'
import {
  SOLID_FRICTION,
  WALKING_POWER,
  NEIGHBOR_POWER,
  WALL_PUSH_POWER,
} from '~/config/physic'
import type { Map, Bot, Universe, Navigation, Point } from '~/type'

const EPSYLON = 0.0001

const round = x => Math.round(x * 10000) / 10000

const handleNavigation = (
  map: Map,
  navigation: Navigation,
  position: Point
) => {
  // compute the path if missing
  if (!navigation.pathToTarget) {
    const path = findPath(
      map,
      pointToCell(position),
      pointToCell(navigation.target)
    )

    if (!path) throw new Error('unreachable target')

    navigation.pathToTarget = path.map(({ x, y }) => ({
      x: x + 0.5,
      y: y + 0.5,
    }))

    // replace the last point by the target
    navigation.pathToTarget[navigation.pathToTarget.length - 1] =
      navigation.target
  }

  // return the farest cell reachable
  const isReachable = cellCenter =>
    rayCastCheck(c => isNavigable(map, c), position, cellCenter)

  while (
    navigation.pathToTarget &&
    navigation.pathToTarget[1] &&
    isReachable(navigation.pathToTarget[1])
  )
    navigation.pathToTarget.shift()
}

export const botMoving = ({ map, bots }: Universe) => {
  const acc = bots.map(({ velocity, position, navigation }: Bot, i) => {
    // compute the acceleration, as sum of every forces
    const a = { x: 0, y: 0 }

    // solid friction
    a.x += -SOLID_FRICTION * velocity.x
    a.y += -SOLID_FRICTION * velocity.y

    // go to target
    if (navigation) {
      handleNavigation(map, navigation, position)

      const nextCell = navigation.pathToTarget[0]

      const d = {
        x: nextCell.x - position.x,
        y: nextCell.y - position.y,
      }

      const l = length(d)

      const ll = Math.min(WALKING_POWER, l)

      if (l > EPSYLON) {
        a.x += (d.x / l) * ll
        a.y += (d.y / l) * ll
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

        a.x -= (d.x / l / l / l) * NEIGHBOR_POWER
        a.y -= (d.y / l / l / l) * NEIGHBOR_POWER
      }
    })

    const cell = pointToCell(position)

    // pushed by walls
    around8.forEach(v => {
      const b = {
        x: cell.x + v.x,
        y: cell.y + v.y,
      }

      // is not a wall
      if (isNavigable(map, b)) return

      // if it's a corner, should be an outside corner
      if (
        v.x * v.y !== 0 &&
        (isNavigable(map, { ...cell, x: cell.x + v.x }) ||
          isNavigable(map, { ...cell, y: cell.y + v.y }))
      )
        return

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
