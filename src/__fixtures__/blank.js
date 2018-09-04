import { blueprints } from '~/config/blueprints'
import { menu } from '~/config/menu'
import type { Universe, UIstate } from '~/type'

const w = 20
const h = 14

export const universe: Universe = {
  bank: 100000,

  //   map: `
  // ####################
  // #..................#
  // #..................#
  // #..................#
  // #..................#
  // #..................#
  // #..................#
  // #..................#
  // #..................#
  // #..................#
  // #..................#
  // ####################
  // `
  //     .trim()
  //     .split('\n')
  //     .map(line => line.split('').map(x => (x === '#' ? 1 : 0))),

  map: Array.from({ length: h }).map((_, y) =>
    Array.from({ length: w }).map(
      (_, x) => (!(x * y) || x == w - 1 || y == h - 1 ? 1 : 0)
    )
  ),

  bots: [],

  menu,

  blueprints,

  customers: [
    { cell: { x: w - 2, y: 4 } },
    { cell: { x: w - 2, y: 5 } },
    { cell: { x: w - 2, y: 6 } },
  ],

  machines: [],

  droppedTokens: [],

  blueprints: [],
}
