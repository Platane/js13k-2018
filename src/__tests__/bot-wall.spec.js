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
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
  ],

  bots: [
    {
      id: '1',
      position: { x: 4.2, y: 2 },
      velocity: { x: 0, y: 0 },

      command: {
        type: 'carry',
        dropCell: { x: 4, y: 2 },
        pickUpCell: { x: 1, y: 2 },
      },

      activity: {
        carrying: null,
      },

      navigation: null,
    },
  ],

  machines: [],

  droppedTokens: [],

  blueprints,
}

test('bot wall push', async t => {
  const ren = createRenderer()

  for (let k = 100; k--; ) {
    await wait(LOOP_DELAY)

    tic(universe)

    ren.update(universe)
  }

  t.pass('should at least not crash')

  ren.destroy()

  t.end()
})
