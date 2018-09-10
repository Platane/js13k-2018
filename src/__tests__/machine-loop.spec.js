import { createRenderer } from './util/createRenderer'
import { findPath } from '~/service/aStar'
import { pointToCell } from '~/service/point'
import { tic } from '~/logic'
import { blueprints, LOOP_DELAY } from '~/config'
import { wait } from '~/util/time'
import test from 'tape'
import type { Universe } from '~/type'

const universe: Universe = {
  map: [
    //
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
  ],

  bots: [
    {
      id: 'm',
      position: { x: 3.5, y: 4.8 },
      velocity: { x: 0, y: 0 },
      l: 0,
      navigation: null,

      command: {
        type: 'activate',
        targetId: '2',
      },

      activity: {
        activationCooldown: 0,
      },
    },
    {
      id: '2m',
      position: { x: 3.1, y: 4.8 },
      velocity: { x: 0, y: 0 },
      l: 0,
      navigation: null,

      command: {
        type: 'activate',
        targetId: '5',
      },

      activity: {
        activationCooldown: 0,
      },
    },
    {
      id: 'x',
      position: { x: 3.6, y: 4.2 },
      velocity: { x: 0, y: 0 },
      l: 0,
      navigation: null,

      command: {
        type: 'carry',
        pickUpCell: { x: 3, y: 1 },
        dropCell: { x: 4, y: 5 },
      },

      activity: {
        carrying: null,
      },
    },
    {
      id: 'y',
      position: { x: 3.6, y: 4.5 },
      velocity: { x: 0, y: 0 },
      l: 0,
      navigation: null,

      command: {
        type: 'carry',
        pickUpCell: { x: 2, y: 5 },
        dropCell: { x: 1, y: 1 },
      },

      activity: {
        carrying: null,
      },
    },
  ],

  clients: [],

  machines: [
    {
      id: '2',

      blueprint: {
        id: '3',
        ground: [[0, 1, 0]],
        activationThreshold: 3,
        inputs: [{ cell: { x: 0, y: 0 }, token: 'citron' }],
        outputs: [{ cell: { x: 2, y: 0 }, token: 'meringue' }],
        recipe: {
          inputs: [{ token: 'citron', n: 1 }],
          outputs: [{ token: 'meringue', n: 1 }],
        },
      },

      rotation: 1,
      positionOrigin: { x: 1, y: 1 },

      processing: null,
    },

    {
      id: '5',

      blueprint: {
        id: '8',
        ground: [[0, 1, 0]],
        activationThreshold: 3,
        inputs: [{ cell: { x: 0, y: 0 }, token: 'meringue' }],
        outputs: [{ cell: { x: 2, y: 0 }, token: 'citron' }],
        recipe: {
          inputs: [{ token: 'meringue', n: 1 }],
          outputs: [{ token: 'citron', n: 1 }],
        },
      },

      rotation: 3,
      positionOrigin: { x: 4, y: 5 },

      processing: null,
    },
  ],

  customers: [],

  droppedTokens: [
    //
    { position: { x: 1.2, y: 1.6 }, token: 'citron' },
  ],

  blueprints,
}

test('machine loop', async t => {
  const ren = createRenderer()

  for (let k = 620; k--; ) {
    await wait(LOOP_DELAY)

    tic(universe)

    ren.update(universe)
  }

  t.pass('should at least not crash')

  ren.destroy()

  t.end()
})
