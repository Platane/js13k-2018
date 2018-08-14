import { createRenderer } from './util/createRenderer'
import { blueprints, LOOP_DELAY } from '~/config'
import { wait } from '~/util/time'
import test from 'tape'
import type { Universe } from '~/type'

const universe: Universe = {
  mouse: {
    activationCooldown: 0,
  },

  map: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],

  bots: [
    {
      id: '1',
      position: { x: 3.5, y: 4.2 },
      direction: { x: 1, y: 0 },

      command: {
        type: 'carry',
        dropCell: { x: 4, y: 2 },
        pickUpCell: { x: 1, y: 1 },
      },

      activity: {
        path: [],
        nextStopIndex: 0,
        carrying: null,
      },
    },
  ],

  machines: [],

  blueprints,
}

test('bot carry', async t => {
  const ren = createRenderer()

  for (let k = 100; k--; ) {
    await wait(LOOP_DELAY)

    ren.update(universe)
  }

  t.pass('should at least not crash')

  ren.destroy()

  t.end()
})
