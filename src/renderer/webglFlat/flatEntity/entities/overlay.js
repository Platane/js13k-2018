import { getWidth, getHeight, isNavigable, around4 } from '~/service/map'
import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { boxes } from '~/renderer/texture'
import { addEntity, renderPath } from './util'
import { renderBot, renderArrow } from './bots'
import { findPath, smoothPath } from '~/service/aStar'
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
  addEntity(100, 100, boxes.black, alpha / 100)(vertices, uvs, opacity, index)({
    x: 0,
    y: 0,
  })

  // drag bot
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

  // selected bot
  const selectedBot =
    !uistate.dragBot &&
    !uistate.dragMachine &&
    universe.bots.find(x => x.id === uistate.selectedBotId)

  if (selectedBot) {
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
        findPath(universe.map, A, B || A) || []
      ).map(cellCenter)

      renderPath(path, boxes.red, 1)(vertices, uvs, opacity, index)
    }

    // bot
    renderBot(selectedBot)(vertices, uvs, opacity, index)
  }

  // drag machine
  if (uistate.dragMachine) {
    renderMachine(
      uistate.dragMachine,
      uistate.dragMachineDroppable ? 0.8 : 0.1
    )(vertices, uvs, opacity, index)
  }
}
