import { getWidth, getHeight, isNavigable, around4 } from '~/service/map'
import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { boxes } from '~/renderer/texture'
import { addEntity } from './util'
import type { Universe, Point, UIstate } from '~/type'

const EPSYLON = 0.014

export const renderBots = (universe: Universe, uistate: UIstate) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => {
  // sort bot by y
  const bots = universe.bots.slice().sort((a, b) => a.position.y - b.position.y)

  // compute directions
  const vs = bots.map(({ velocity, position }) => {
    const l = length(velocity)
    return {
      v:
        l < EPSYLON ? { x: 0, y: 1 } : { x: velocity.x / l, y: velocity.y / l },
      vl: l,
    }
  })

  // draw arrows
  bots.forEach((bot, i) => {
    const { position } = bot

    const { v, vl } = vs[i]

    const selected = bot.id === uistate.selectedBotId

    const direction = {
      x: -v.x,
      y: -v.y,
    }

    const size = selected ? 0.7 : 0.6

    const box = selected
      ? boxes.arrow_selected
      : vl < EPSYLON
        ? boxes.arrow_idle
        : boxes.arrow

    addEntity(size, size, box)(vertices, uvs, opacity, index)(
      bot.position,
      direction
    )
  })

  // draw bots
  bots.forEach((bot, i) => {
    const { velocity, position } = bot

    const { v } = vs[i]

    let max = -1
    let k = 0
    around4.find((p, i) => {
      const m = p.x * v.x + p.y * v.y

      if (max < m) {
        max = m
        k = i
      }
    })

    const h = Math.sin((position.y * 0.8 + position.x * 1.2) * 10)

    addEntity(0.45, 0.45, boxes['bot' + k])(vertices, uvs, opacity, index)({
      x: position.x,
      y: position.y - 0.3 + h * 0.08,
    })

    if (bot.activity && bot.activity.carrying) {
      const token = bot.activity.carrying

      const v = normalize(velocity)

      const c = {
        x: position.x - v.x * 0.3,
        y: position.y - v.y * 0.3,
      }

      addEntity(0.3, 0.3, boxes[token])(vertices, uvs, opacity, index)(c)
    }
  })

  if (uistate.dragBot) {
    addEntity(
      0.45,
      0.45,
      boxes['bot' + 0],
      uistate.dragBotDroppable ? 0.8 : 0.1
    )(vertices, uvs, opacity, index)({
      x: uistate.dragBot.position.x,
      y: uistate.dragBot.position.y - 0.3,
    })
  }
}
