import { getWidth, getHeight, isNavigable, around4 } from '~/service/map'
import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { boxes } from '~/renderer/texture'
import {
  texture_black_box,
  texture_red_box,
} from '~/renderer/texture/svg/arrow'
import { addEntity, renderPath } from './util'
import { renderBot, renderArrow } from './bots'
import { findPath, smoothPath } from '~/service/aStar'
import { proj as projMachine } from '~/service/machine'
import { renderMachine } from './machines'

import type { Universe, Point, UIstate } from '~/type'

const EPSYLON = 0.014

let alpha = 0

export const renderOverlay = (universe: Universe, uistate: UIstate) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => {
  const withOverlay = uistate.command || uistate.dragBot || uistate.dragMachine

  const targetA = withOverlay ? 4 * 11 : 0

  if (alpha !== targetA) {
    alpha = Math.round(alpha + (alpha < targetA ? 4 : -4))
  }

  // overlay
  addEntity(100, 100, texture_black_box, alpha / 100)(
    vertices,
    uvs,
    opacity,
    index
  )({
    x: 0,
    y: 0,
  })

  // drag bot
  if (uistate.dragBot) {
    addEntity(
      0.3,
      0.3,
      boxes['texture_bot' + 0],
      uistate.dragBotDroppable ? 0.8 : 0.1
    )(vertices, uvs, opacity, index)({
      x: uistate.dragBot.position.x,
      y: uistate.dragBot.position.y - 0.3,
    })
  }

  // selected bot
  const selectedBot =
    !uistate.dragBot &&
    !uistate.dragMachine &&
    universe.bots.find(x => x.id === uistate.selectedBotId)

  if (selectedBot) {
    // machines
    universe.machines.forEach(m => {
      const w = getWidth(m.blueprint.ground)
      const h = getHeight(m.blueprint.ground)

      const alpha = selectedBot.command.targetId === m.id ? 0.8 : 0.3

      for (let x = w; x--; )
        for (let y = h; y--; )
          if (!isNavigable(m.blueprint.ground, { x, y }))
            addEntity(0.5, 0.5, texture_red_box, alpha)(
              vertices,
              uvs,
              opacity,
              index
            )(
              cellCenter(
                projMachine(m)({
                  x,
                  y,
                })
              )
            )

      // arrow
      renderArrow(selectedBot, true)(vertices, uvs, opacity, index)

      // path

      let A, B

      if (selectedBot.command.type === 'carry') {
        A = selectedBot.command.pickUpCell
        B = selectedBot.command.dropCell
      }

      if (uistate.command && uistate.command.dropCell) {
        A = uistate.command.pickUpCell
        B = uistate.command.dropCell
      }

      if (A) {
        const path = smoothPath(
          universe.map,
          findPath(universe.map, A, B) || []
        ).map(cellCenter)

        renderPath(path, texture_red_box, 1)(vertices, uvs, opacity, index)
      }

      // bot
      renderBot(selectedBot)(vertices, uvs, opacity, index)
    })
  }

  // drag machine
  if (uistate.dragMachine) {
    renderMachine(
      uistate.dragMachine,
      uistate.dragMachineDroppable ? 0.8 : 0.1
    )(vertices, uvs, opacity, index)
  }
}
