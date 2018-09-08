import { getWidth, getHeight, isNavigable, around4 } from '~/service/map'
import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { boxes } from '~/renderer/texture'
import { addEntity } from './util'
import type { Universe, Point, UIstate } from '~/type'

export const renderBots = (universe: Universe, uistate: UIstate) => (
  vertices: number[],
  uvs: number[],
  index: number[]
) => {
  // sort bot by y
  const bots = universe.bots.slice().sort((a, b) => a.position.y - b.position.y)

  // compute directions
  const vs = bots.map(({ velocity, position }) => {
    const l = length(velocity)
    return l < 0.014 ? { x: 0, y: 1 } : { x: velocity.x / l, y: velocity.y / l }
  })

  // draw arrows
  bots.forEach((bot, i) => {
    const { position } = bot

    const v = vs[i]

    const selected = bot.id === uistate.selectedBotId

    addEntity(
      selected ? 0.9 : 0.6,
      selected ? boxes.arrow_selected : boxes.arrow
    )(vertices, uvs, index)(bot.position, {
      x: -v.x,
      y: -v.y,
    })
  })

  // draw bots
  bots.forEach((bot, i) => {
    const { velocity, position } = bot

    const v = vs[i]

    let max = -1
    let k = 0
    around4.find((p, i) => {
      const m = p.x * v.x + p.y * v.y

      if (max < m) {
        max = m
        k = i
      }
    })

    const h = Math.sin(position.x * 10) + Math.sin(position.y * 10)

    addEntity(0.45, boxes['bot' + k])(vertices, uvs, index)({
      x: position.x,
      y: position.y - 0.3 + h * 0.1,
    })

    if (bot.activity && bot.activity.carrying) {
      const token = bot.activity.carrying

      const v = normalize(velocity)

      const c = {
        x: position.x - v.x * 0.3,
        y: position.y - v.y * 0.3,
      }

      addEntity(0.3, boxes[token])(vertices, uvs, index)(c)
    }
  })
}
