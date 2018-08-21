import { createRenderer } from './util/createRenderer'
import { findPath } from '~/service/aStar'
import { pointToCell } from '~/service/point'
import { tic } from '~/logic'
import { blueprints, LOOP_DELAY } from '~/config'
import { wait } from '~/util/time'
import test from 'tape'
import type { Universe } from '~/type'

const universe: Universe = {
  map: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],

  bots: [
    {
      id: 'm',
      position: { x: 3.5, y: 3.8 },
      velocity: { x: 0, y: 0 },

      navigation: null,

      command: {
        type: 'activate',
        targetId: '2',
      },

      activity: {
        activationCooldown: 0,
      },
    },
  ],

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
  ],

  droppedTokens: [
    //
    { position: { x: 1.2, y: 1.6 }, token: 'citron' },
  ],

  blueprints,
}

test('machine activate', async t => {
  const ren = createRenderer()

  for (let k = 220; k--; ) {
    await wait(LOOP_DELAY)

    tic(universe)

    ren.update(universe)
  }

  t.pass('should at least not crash')

  ren.destroy()

  t.end()
})
