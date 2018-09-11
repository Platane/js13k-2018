import type { Blueprint } from '~/type'

export const blueprints: Blueprint[] = [
  // {
  //   id: 'u',
  //
  //   ground: [[1]],
  //
  //   buildingCost: 2000,
  //   activationThreshold: 100,
  //
  //   recipe: {
  //     inputs: [],
  //     outputs: [],
  //   },
  //
  //   inputs: [],
  //   outputs: [],
  // },
  {
    id: 'rice-grain-harvester',

    ground: [[1, 0], [1, 0], [1, 1]],

    buildingCost: 2000,
    activationThreshold: 20,

    recipe: {
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
      inputs: [],
      outputs: [{ token: 'raw-tuna', n: 2 }],
    },

    inputs: [],
    outputs: [{ cell: { x: 0, y: 1 }, token: 'raw-tuna' }],
  },
  {
    id: 'sushi-roller',

    ground: [[0, 1, 1], [0, 1, 1], [0, 0, 0]],

    buildingCost: 20000000,
    activationThreshold: 20,

    recipe: {
      inputs: [{ token: 'rice-ball', n: 2 },{ token: 'raw-tuna', n: 1 }],
      outputs: [{ token: 'sushi', n: 1 }],
    },

    inputs: [
      { cell: { x: 2, y: 2 }, token: 'raw-tuna' },
      { cell: { x: 2, y: 2 }, token: 'rice-ball' },
    ],
    outputs: [{ cell: { x: 0, y: 1 }, token: 'sushi' }],
  },
]
