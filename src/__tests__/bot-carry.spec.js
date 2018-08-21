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
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],

  bots: [
    {
      id: '1',
      position: { x: 3.5, y: 4.2 },
      velocity: { x: 0.02, y: 0 },

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

  droppedTokens: [
    //
    { position: { x: 1.5, y: 2.5 }, token: 'citron' },
    { position: { x: 1.3, y: 2.4 }, token: 'citron' },
  ],

  blueprints,
}

test('bot carry', async t => {
  const ren = createRenderer()

  for (let k = 220; k--; ) {
    await wait(LOOP_DELAY)

    tic(universe)

    ren.update(universe)
  }

  t.pass('should at least not crash')

  t.deepEqual(
    universe.droppedTokens.map(x => pointToCell(x.position)),
    [{ x: 4, y: 2 }, { x: 4, y: 2 }],
    'should have moved the tokens'
  )

  ren.destroy()

  t.end()
})
