import { createRenderer } from './__tests__/util/createRenderer'
import { createActionLayer } from '~/logic/actionLayer'
import { createUI } from '~/renderer/ui'
import { createWebGL } from '~/renderer/webgl'
import { tic } from './logic'
import type { Universe, UIstate } from '~/type'

const universe: Universe = {
  map: `
############################
#...................#......#
#...........#######.#......#
#...............#...#......#
#...............#.###......#
#...............#..........#
#.....################.....#
#.....#....................#
#.....#....................#
#.....#.....#..............#
#.....#.....#..............#
#.....#.....#..............#
#.....#.....#..............#
#...........#..............#
#...........#..............#
#...........#..............#
#...........#..............#
#...........#..............#
############################
`
    .trim()
    .split('\n')
    .map(line => line.split('').map(x => (x === '#' ? 1 : 0))),

  bots: Array.from({ length: 8 }).map((_, i) => ({
    id: `i${i}`,

    position: { x: 3.5 + (i % 2) * 0.03, y: 4.2 + i },
    velocity: { x: 0, y: 0 },

    command: { type: 'idle' },
    navigation: null,
    activity: null,
  })),

  machines: [],

  droppedTokens: [
    { position: { x: 8.3, y: 3.5 }, token: 'yellow' },
    { position: { x: 8.1, y: 3.2 }, token: 'yellow' },
    { position: { x: 8.6, y: 3.7 }, token: 'yellow' },
    { position: { x: 8.7, y: 3.2 }, token: 'yellow' },
    { position: { x: 14.3, y: 3.57 }, token: 'blue' },
  ],

  blueprints: [],
}

Object.assign(universe.bots[0], {
  command: {
    type: 'carry',
    pickUpCell: { x: 8, y: 3 },
    dropCell: { x: 13, y: 13 },
  },
  activity: { carrying: null },
})
Object.assign(universe.bots[1], {
  command: {
    type: 'carry',
    pickUpCell: { x: 13, y: 13 },
    dropCell: { x: 18, y: 7 },
  },
  activity: { carrying: null },
})
Object.assign(universe.bots[2], {
  command: {
    type: 'carry',
    pickUpCell: { x: 18, y: 7 },
    dropCell: { x: 8, y: 3 },
  },
  activity: { carrying: null },
})

const uistate: UIstate = {
  selectedBotId: null,
  pickUpCell: null,
}

const webgl = createWebGL(document.getElementsByTagName('canvas')[0])

const renderer = createRenderer()

createActionLayer(
  document.getElementById('app'),
  universe,
  uistate,
  renderer.camera
)

const ui = createUI(document.getElementById('app'))

const loop = () => {
  tic(universe)

  renderer.update(universe)
  webgl.update(universe, renderer.camera)

  ui.update(universe, uistate)

  requestAnimationFrame(loop)
}

loop()
