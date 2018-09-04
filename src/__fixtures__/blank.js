import { blueprints } from '~/config/blueprints'
import { menu } from '~/config/menu'
import type { Universe, UIstate } from '~/type'

export const universe: Universe = {
  bank: 100000,

  map: `####################
#..................#
#..................#
#..................#
#..................#
#..................#
#..................#
#..................#
#..................#
#..................#
#..................#
####################`
    .trim()
    .split('\n')
    .map(line => line.split('').map(x => (x === '#' ? 1 : 0))),

  bots: [],

  menu,

  blueprints,

  customers: [{ cell: { x: 10, y: 4 } }],

  machines: [],

  droppedTokens: [],

  blueprints: [],
}
