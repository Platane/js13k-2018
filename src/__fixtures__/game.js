import { blueprints } from '~/config/blueprints'
import { menu } from '~/config/menu'
import type { Universe, UIstate } from '~/type'

const w = 14
const h = 12

const map = Array.from({ length: h }).map((_, y) =>
  Array.from({ length: w }).map(
    (_, x) => 0
    // (_, x) => (!(x * y) || x == w - 1 || y == h - 1 ? 1 : 0)
  )
)

map[1][8] = 3
map[1][9] = 3
map[1][10] = 3
map[2][10] = 3
map[2][8] = 2

map[4][w - 2] = 2
map[5][w - 2] = 2
map[6][w - 2] = 2

map[4][w - 1] = 2
map[5][w - 1] = 2
map[6][w - 1] = 2

map[0][0] = 1
map[0][1] = 1
map[0][4] = 1
map[7][0] = 1
map[8][0] = 1
map[9][0] = 1
map[11][0] = 1

map[0][w - 2] = 1
map[1][w - 2] = 1
map[0][w - 1] = 1
map[1][w - 1] = 1
map[2][w - 1] = 1
map[3][w - 1] = 1
map[10][w - 1] = 1
map[7][w - 1] = 1
map[8][w - 1] = 1
map[9][w - 1] = 1

map[5][3] = 1
map[5][4] = 1
map[5][5] = 1
map[5][6] = 1

map[5][9] = 1
map[9][9] = 1
map[8][9] = 1
map[7][9] = 1
map[6][9] = 1
map[6][10] = 1
map[4][10] = 1
map[5][10] = 1
map[7][10] = 1

export const universe: Universe = {
  bank: 860,

  map,

  bots: [
    {
      id: '1',
      position: { x: 8.3, y: 6.5 },
      velocity: { x: 0, y: 0 },
      l: 0,
      command: { type: 'idle' },
      activity: null,
      navigation: null,
    },
  ],

  clients: [],

  menu,

  blueprints,

  customers: [
    // { cell: { x: w - 2, y: 4 } },
    // { cell: { x: w - 2, y: 5 } },
    // { cell: { x: w - 2, y: 6 } },
  ],

  machines: [
    {
      id: '1',
      positionOrigin: { x: 8, y: 1 },
      rotation: 0,
      blueprint: blueprints[0],
      processing: {
        k: blueprints[0].activationThreshold - 1,
        activationCoolDown: 0,
      },
    },
  ],

  droppedTokens: [],

  blueprints: [],
}
