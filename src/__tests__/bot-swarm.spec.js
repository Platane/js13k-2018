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
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],

  bots: Array.from({ length: 3 }).map((_, i, arr) => ({
    id: 'id' + i,
    position: { x: 3.1 + (1.8 * i) / arr.length, y: 4.2 },
    velocity: { x: 0, y: 0 },

    command: {
      type: 'carry',
      dropCell: { x: 4, y: 2 },
      pickUpCell: { x: 1, y: 2 },
    },

    activity: {
      path: [],
      nextCell: { x: 0, y: 0 },
      carrying: null,
    },
  })),

  machines: [],

  droppedTokens: [],

  blueprints,
}

universe.bots.forEach(
  bot =>
    bot.command.type === 'carry' &&
    (bot.activity.path =
      findPath(universe.map, bot.command.dropCell, bot.command.pickUpCell) ||
      [])
)

test('bot swarm', async t => {
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
