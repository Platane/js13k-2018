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
#..#........#######.#......#
#...............#...#......#
#...............#.###......#
#...............#..........#
#.....################.....#
#.....#....................#
#.....#....................#
#.....#.....#...######.....#
#.....#.....#...#....#.....#
#.....#.....#...#.#..#.....#
#.....#.....#...#..........#
#...........#...#..........#
#...........#...#######....#
#...........#..............#
#...........#..............#
#...........#..............#
############################
`
    .trim()
    .split('\n')
    .map(line => line.split('').map(x => (x === '#' ? 1 : 0))),

  bots: Array.from({ length: 14 }).map((_, i) => ({
    id: `i${i}`,

    position: { x: 3.5 + (i % 2) * 0.03, y: 4.2 + i * 0.3 },
    velocity: { x: 0, y: 0 },

    command: { type: 'idle' },
    navigation: null,
    activity: null,
  })),

  machines: [
    {
      id: '2',

      blueprint: {
        id: '3',
        ground: [[0, 1, 0]],
        activationThreshold: 20,
        inputs: [{ cell: { x: 0, y: 0 }, token: 'yellow' }],
        outputs: [{ cell: { x: 2, y: 0 }, token: 'purple' }],
        recipe: {
          inputs: [{ token: 'yellow', n: 1 }],
          outputs: [{ token: 'purple', n: 1 }],
        },
      },

      rotation: 1,
      positionOrigin: { x: 2, y: 2 },

      processing: null,
    },
    {
      id: '5',

      blueprint: {
        id: '13',
        ground: [[0, 1, 0]],
        activationThreshold: 20,
        inputs: [{ cell: { x: 0, y: 0 }, token: 'purple' }],
        outputs: [{ cell: { x: 2, y: 0 }, token: 'yellow' }],
        recipe: {
          inputs: [{ token: 'purple', n: 1 }],
          outputs: [{ token: 'yellow', n: 1 }],
        },
      },

      rotation: 2,
      positionOrigin: { x: 18, y: 12 },

      processing: null,
    },
  ],

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
    dropCell: { x: 25, y: 7 },
  },
  activity: { carrying: null },
})
Object.assign(universe.bots[2], {
  command: {
    type: 'carry',
    pickUpCell: { x: 25, y: 7 },
    dropCell: { x: 2, y: 2 },
  },
  activity: { carrying: null },
})
Object.assign(universe.bots[3], {
  command: {
    type: 'activate',
    targetId: '5',
  },
  activity: { activationCooldown: 0 },
})
Object.assign(universe.bots[4], {
  command: {
    type: 'activate',
    targetId: '5',
  },
  activity: { activationCooldown: 0 },
})
Object.assign(universe.bots[5], {
  command: {
    type: 'activate',
    targetId: '5',
  },
  activity: { activationCooldown: 0 },
})
Object.assign(universe.bots[6], {
  command: {
    type: 'activate',
    targetId: '2',
  },
  activity: { activationCooldown: 0 },
})
Object.assign(universe.bots[7], {
  command: {
    type: 'carry',
    pickUpCell: { x: 4, y: 2 },
    dropCell: { x: 18, y: 12 },
  },
  activity: { carrying: null },
})
Object.assign(universe.bots[8], {
  command: {
    type: 'carry',
    pickUpCell: { x: 18, y: 10 },
    dropCell: { x: 8, y: 3 },
  },
  activity: { carrying: null },
})

const webgl = createWebGL(document.getElementsByTagName('canvas')[0])

const renderer = createRenderer()

createActionLayer(
  document.getElementById('app'),
  universe,
  renderer.uistate,
  renderer.camera
)

const ui = createUI(document.getElementById('app'))

const loop = () => {
  tic(universe)

  renderer.update(universe)
  webgl.update(universe, renderer.camera)

  ui.update(universe, renderer.uistate)

  requestAnimationFrame(loop)
}

loop()
