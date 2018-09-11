import { getWidth, getHeight, isNavigable, around4 } from '~/service/map'
import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { boxes } from '~/renderer/texture'
import { addEntity } from './util'
import {
  texture_arrow_selected_box,
  texture_arrow_idle_box,
  texture_arrow_box,
} from '~/renderer/texture/svg/arrow'
import type { Universe, Point, Bot, UIstate } from '~/type'

const EPSYLON = 0.014

export const renderBot = (bot: Bot, boxLabel = 'texture_bot') => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => {
  const { position, velocity } = bot

  const l = length(velocity)
  const v =
    l < EPSYLON ? { x: 0, y: 1 } : { x: velocity.x / l, y: velocity.y / l }

  let max = -1
  let k = 0
  around4.find((p, i) => {
    const m = p.x * v.x + p.y * v.y

    if (max < m) {
      max = m
      k = i
    }
  })

  const h = Math.sin(bot.l * 12) * 0.08

  addEntity(0.4, 0.4, boxes[boxLabel + k])(vertices, uvs, opacity, index)({
    x: position.x,
    y: position.y - 0.3 + h,
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
}

export const renderArrow = (bot: Bot, selected: boolean = false) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => {
  const { position, velocity } = bot

  const l = length(velocity)
  const v =
    l < EPSYLON ? { x: 0, y: 1 } : { x: velocity.x / l, y: velocity.y / l }

  const direction = {
    x: -v.x,
    y: -v.y,
  }

  const size = selected ? 0.7 : 0.48

  const box = selected
    ? texture_arrow_selected_box
    : l < EPSYLON
      ? texture_arrow_idle_box
      : texture_arrow_box

  addEntity(size, size, box)(vertices, uvs, opacity, index)(position, direction)
}

export const renderBots = (universe: Universe, uistate: UIstate) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => {
  // sort bot by y
  const people = [...universe.bots, ...universe.clients].sort(
    (a, b) => a.position.y - b.position.y
  )

  // draw arrows
  universe.bots.forEach(bot => renderArrow(bot)(vertices, uvs, opacity, index))

  // draw bots
  people.forEach(bot =>
    renderBot(
      bot,
      bot.client
        ? bot.client === 'A'
          ? 'texture_clientA'
          : 'texture_clientB'
        : 'texture_bot'
    )(vertices, uvs, opacity, index)
  )
}
