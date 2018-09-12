import { createActionLayer } from '~/logic/actionLayer'
import { updateUi } from '~/renderer/ui'
import { updateTutorial } from '~/renderer/ui/tutorial'
import { createWebGL } from '~/renderer/webglFlat'
import { tic } from './logic'
import { blueprints } from '~/config'
import { universe } from '~/__fixtures__/game'
import type { Universe, UIstate } from '~/type'

import '~/renderer/texture'

const uistate: UIstate = {
  // selectedBotId: null,
  // pickUpCell: null,
  selectedBlueprintRotation: 0,
  selectedBlueprintId: blueprints[1].id,
  // shopOpened: false,
  step: 0,
  // command: null,
  // dragBot: null,
  // dragBotDroppable: false,
  // dragMachine: null,
  // dragMachineDroppable: false,
}

const canvas = document.getElementsByTagName('canvas')[0]

const webgl = createWebGL(canvas)

createActionLayer(document.body, universe, uistate)

const loop = () => {
  tic(universe)

  webgl(universe, uistate)

  updateUi(universe, uistate)
  updateTutorial(universe, uistate)

  // if (uistate.command || uistate.dragMachine || uistate.dragBot) {
  //   setTimeout(loop, 30)
  // } else {
  //   requestAnimationFrame(loop)
  // }

  requestAnimationFrame(loop)
}

loop()
