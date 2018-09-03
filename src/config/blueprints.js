import type { Blueprint } from '~/type'

export const blueprints: Blueprint[] = [
  {
    id: 'u',

    ground: [[1]],

    buildingCost: 2000,
    activationThreshold: 20,

    recipe: {
      cost: 0,
      inputs: [],
      outputs: [{ token: 'rice-grain', n: 1 }],
    },

    inputs: [],
    outputs: [],
  },
  {
    id: 'rice-grain-harvester',

    ground: [[1, 0], [1, 0], [1, 1]],

    buildingCost: 2000,
    activationThreshold: 20,

    recipe: {
      cost: 0,
      inputs: [],
      outputs: [{ token: 'rice-grain', n: 1 }],
    },

    inputs: [],
    outputs: [{ cell: { x: 1, y: 0 }, token: 'rice-grain' }],
  },
  {
    id: 'rice-cooker',

    ground: [[0, 1, 0], [0, 1, 1], [0, 1, 0]],

    buildingCost: 2000,
    activationThreshold: 20,

    recipe: {
      cost: 0,
      inputs: [{ token: 'rice-grain', n: 2 }],
      outputs: [{ token: 'rice-ball', n: 1 }],
    },

    inputs: [
      { cell: { x: 2, y: 0 }, token: 'rice-grain' },
      { cell: { x: 2, y: 2 }, token: 'rice-grain' },
    ],
    outputs: [{ cell: { x: 0, y: 1 }, token: 'rice-ball' }],
  },
  {
    id: 'tuna-fishing-spot',

    ground: [[0, 1, 1, 1], [0, 1, 1, 1], [0, 1, 1, 1], [0, 0, 0, 0]],

    buildingCost: 2000,
    activationThreshold: 50,

    recipe: {
      cost: 0,
      inputs: [],
      outputs: [{ token: 'raw-tuna', n: 2 }],
    },

    inputs: [],
    outputs: [{ cell: { x: 0, y: 1 }, token: 'tuna-bit' }],
  },
  {
    id: 'tuna-skin-workshop',

    ground: [[0, 1, 1], [0, 1, 1], [0, 0, 0]],

    buildingCost: 2000,
    activationThreshold: 20,

    recipe: {
      cost: 0,
      inputs: [{ token: 'raw-tuna', n: 1 }],
      outputs: [{ token: 'tuna-bit', n: 2 }],
    },

    inputs: [{ cell: { x: 2, y: 2 }, token: 'raw-tuna' }],
    outputs: [{ cell: { x: 0, y: 1 }, token: 'tuna-bit' }],
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
