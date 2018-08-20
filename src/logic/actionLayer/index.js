import { unproj } from '~/service/camera'
import { distanceSq } from '~/service/point'
import type { ID, UIstate, Camera, Universe } from '~/type'

export const createActionLayer = (
  element: Element,
  universe: Universe,
  uistate: UIstate,
  camera: Camera
) => {
  const onclick = (e: MouseEvent) => {
    const pointer = unproj(camera)({ x: e.clientX, y: e.clientY })

    const bot = universe.bots.find(
      ({ position }) => distanceSq(position, pointer) < 0.5 * 0.5
    )

    if (e.button === 0) {
      uistate.selectedBotId = bot ? bot.id : null
    } else if (e.button === 2) {
      //
    }
  }

  element.addEventListener('mousedown', onclick)
}
