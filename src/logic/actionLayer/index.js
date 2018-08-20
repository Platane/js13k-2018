import { unproj } from '~/service/camera'
import { distanceSq, pointToCell } from '~/service/point'
import { findPath } from '~/service/aStar'
import type { ID, UIstate, Camera, Universe } from '~/type'

export const createActionLayer = (
  element: Element,
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => {
  const onclick = (e: MouseEvent) => {
    const pointer = unproj(camera)({ x: e.clientX, y: e.clientY })

    const cell = pointToCell(pointer)

    if (e.button === 0) {
      const bot = universe.bots.find(
        ({ position }) => distanceSq(position, pointer) < 0.5 * 0.5
      )

      const botId = bot ? bot.id : null

      if (uistate.selectedBotId !== botId) {
        uistate.selectedBotId = botId
        uistate.pickUpCell = null
      }
    }

    const bot = universe.bots.find(({ id }) => id === uistate.selectedBotId)

    if (e.button === 2 && bot) {
      if (uistate.pickUpCell) {
        // compute path
        const path = findPath(universe.map, cell, uistate.pickUpCell, cell)

        if (!path) window.alert('this cell can not be reached')
        else {
          if (bot.activity && bot.activity.carrying) {
            // drop to the ground
          }

          bot.command = {
            type: 'carry',
            dropCell: cell,
            pickUpCell: uistate.pickUpCell,
          }

          bot.activity = {
            carrying: null,
            path,
            nextCell: { ...path[0] },
          }

          // reset uistate
          uistate.pickUpCell = null
        }
      } else {
        uistate.pickUpCell = cell
      }
      //
    }

    if (e.button === 2) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  element.addEventListener('mousedown', onclick)
  element.addEventListener('contextmenu', e => {
    e.preventDefault()
    e.stopPropagation()
  })
}
