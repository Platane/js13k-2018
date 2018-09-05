import { createRenderer } from './__tests__/util/createRenderer'
import { createActionLayer } from '~/logic/actionLayer'
import { createUI } from '~/renderer/ui'
import { createWebGL } from '~/renderer/webglFlat'
import { tic } from './logic'
import { universe } from '~/__fixtures__/game'
import type { Universe, UIstate } from '~/type'

import '~/renderer/texture'

const uistate: UIstate = {
  selectedBotId: null,
  pickUpCell: null,
  selectedBlueprintRotation: 0,
  selectedBlueprintId: 'rice-cooker',
  shopOpened: false,
  step: 0,
  command: null,
  dragBot: null,
  dragBotDroppable: false,
  dragMachine: null,
  dragMachineDroppable: false,
}

const webgl = createWebGL(document.getElementsByTagName('canvas')[0])

const renderer = createRenderer()

createActionLayer(
  document.getElementById('app'),
  universe,
  uistate,
  renderer.camera
)

const uiUpdate = createUI(document.getElementById('app'))

const loop = () => {
  tic(universe)

  renderer.update(universe, uistate)
  webgl(universe, renderer.camera)

  uiUpdate(universe, uistate)

  if (uistate.command || uistate.dragMachine || uistate.dragBot) {
    setTimeout(loop, 60)
  } else {
    requestAnimationFrame(loop)
  }
}

loop()
