import { createRenderer } from './__tests__/util/createRenderer'
import { createActionLayer } from '~/logic/actionLayer'
import { createUI } from '~/renderer/ui'
import { createWebGL } from '~/renderer/webgl'
import { tic } from './logic'
import { universe } from '~/__fixtures__/game'
import type { Universe, UIstate } from '~/type'

const webgl = createWebGL(document.getElementsByTagName('canvas')[0])

const renderer = createRenderer()

createActionLayer(
  document.getElementById('app'),
  universe,
  renderer.uistate,
  renderer.camera
)

const uiUpdate = createUI(document.getElementById('app'))

const loop = () => {
  tic(universe)

  renderer.update(universe)
  // webgl.update(universe, renderer.camera)

  uiUpdate(universe, renderer.uistate)

  if (
    renderer.uistate.command ||
    renderer.uistate.dragMachine ||
    renderer.uistate.dragBot
  ) {
    setTimeout(loop, 60)
  } else {
    requestAnimationFrame(loop)
  }
}

loop()
