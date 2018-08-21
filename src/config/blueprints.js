import type { Blueprint } from '~/type'

export const blueprints: Blueprint[] = [
  {
    id: 'copper-mineral',

    ground: [[1]],

    activationThreshold: 100,

    recipe: {
      inputs: [],
      outputs: [{ token: 'copper', n: 1 }],
    },

    inputs: [],
    outputs: [{ cell: { x: 0, y: 1 }, token: 'copper' }],
  },
  // {
  //   id: 'gold-mineral',
  //
  //   ground: [[true]],
  //
  //   activationThreshold: 100,
  //
  //   inputs: [],
  //   outputs: [{ cell: { x: 0, y: 1 }, token: 'gold', n: 1 }],
  // },
  // {
  //   id: 'iron-mineral',
  //
  //   ground: [[true]],
  //
  //   activationThreshold: 100,
  //
  //   inputs: [],
  //   outputs: [{ cell: { x: 0, y: 1 }, token: 'iron', n: 1 }],
  // },
  //
  // {
  //   id: 'bronze-melter',
  //
  //   ground: [[true], [true]],
  //
  //   activationThreshold: 50,
  //
  //   inputs: [
  //     { cell: { x: -1, y: 0 }, token: 'iron', n: 2 },
  //     { cell: { x: 1, y: 0 }, token: 'copper', n: 1 },
  //   ],
  //   outputs: [{ cell: { x: 0, y: 2 }, token: 'bronze', n: 1 }],
  // },
]
