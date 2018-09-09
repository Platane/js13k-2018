import { blueprints } from '~/config/blueprints'
import { menu } from '~/config/menu'
import type { Universe, UIstate } from '~/type'

const w = 20
const h = 14

const map = Array.from({ length: h }).map((_, y) =>
  Array.from({ length: w }).map(
    (_, x) => 0
    // (_, x) => (!(x * y) || x == w - 1 || y == h - 1 ? 1 : 0)
  )
)

map[1][8] = 1
map[1][9] = 1
map[1][10] = 1
map[2][10] = 1

map[0][0] = 1
map[0][1] = 1
map[0][4] = 1
map[7][0] = 1
map[8][0] = 1
map[9][0] = 1
map[11][0] = 1

map[4][w - 2] = 2
map[5][w - 2] = 2
map[6][w - 2] = 2

export const universe: Universe = {
  bank: 100000,

  map,

  bots: [
    {
      id: '1',
      position: { x: 9.3, y: 6.5 },
      velocity: { x: 0, y: 0 },
      command: { type: 'idle' },
      activity: null,
    },
  ],

  menu,

  blueprints,

  customers: [
    { cell: { x: w - 2, y: 4 } },
    { cell: { x: w - 2, y: 5 } },
    { cell: { x: w - 2, y: 6 } },
  ],

  machines: [
    {
      id: '1',
      positionOrigin: { x: 8, y: 1 },
      rotation: 0,
      blueprint: blueprints[0],
      processing: {
        k: blueprints[0].activationThreshold - 2,
        activated: false,
      },
    },
  ],

  droppedTokens: [],

  blueprints: [],
}
