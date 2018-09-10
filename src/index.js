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
  step: 40,
  command: null,
  dragBot: null,
  dragBotDroppable: false,
  dragMachine: null,
  dragMachineDroppable: false,
}

const canvas = document.getElementsByTagName('canvas')[0]

const webgl = createWebGL(canvas)

createActionLayer(document.body, universe, uistate)

const uiUpdate = createUI(document.body)

const loop = () => {
  tic(universe)

  webgl(universe, uistate)

  uiUpdate(universe, uistate)

  // if (uistate.command || uistate.dragMachine || uistate.dragBot) {
  //   setTimeout(loop, 30)
  // } else {
  //   requestAnimationFrame(loop)
  // }

  requestAnimationFrame(loop)
}

loop()
