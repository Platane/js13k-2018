import { createRenderer } from './__tests__/util/createRenderer'
import { tic } from './logic'
import type { Universe } from '~/type'

const renderer = createRenderer()

const universe: Universe = {
  map: `
############################
#..........................#
#...........#####..........#
#...............#..........#
#...............#..........#
#...............#..........#
#.....###########..........#
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

  bots: Array.from({ length: 5 }).map((_, i) => ({
    id: `i${i}`,

    position: { x: 3.5 + (i % 2) * 0.03, y: 4.2 + i },
    velocity: { x: 0, y: 0 },

    command: { type: 'idle' },
    activity: null,
  })),

  machines: [],

  droppedTokens: [],

  blueprints: [],
}

const loop = () => {
  tic(universe)

  renderer.update(universe)

  requestAnimationFrame(loop)
}

loop()
