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
    id: 'Rice Grain Harvester',

    ground: [[1, 0], [1, 0], [1, 1]],

    buildingCost: 900,
    activationThreshold: 20,

    recipe: {
      inputs: [],
      outputs: [{ token: 'rice-grain', n: 1 }],
    },

    inputs: [],
    outputs: [{ cell: { x: 1, y: 0 }, token: 'rice-grain' }],
  },
  {
    id: 'Rice Cooker',

    ground: [[0, 1, 0], [0, 1, 1], [0, 1, 0]],

    buildingCost: 300,
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
    id: 'Tuna Fishing Spot',

    ground: [[0, 1, 1, 1], [0, 1, 1, 1], [0, 1, 1, 1], [0, 0, 0, 0]],

    buildingCost: 1500,
    activationThreshold: 50,

    recipe: {
      inputs: [],
      outputs: [{ token: 'raw-tuna', n: 2 }],
    },

    inputs: [],
    outputs: [{ cell: { x: 0, y: 1 }, token: 'raw-tuna' }],
  },
  {
    id: 'Sushi Roller',

    ground: [[0, 1, 1], [0, 1, 1], [0, 0, 0]],

    buildingCost: 2000,
    activationThreshold: 20,

    recipe: {
      inputs: [{ token: 'rice-ball', n: 2 }, { token: 'raw-tuna', n: 1 }],
      outputs: [{ token: 'sushi-token', n: 1 }],
    },

    inputs: [
      { cell: { x: 2, y: 2 }, token: 'raw-tuna' },
      { cell: { x: 2, y: 2 }, token: 'rice-ball' },
    ],
    outputs: [{ cell: { x: 0, y: 1 }, token: 'sushi-token' }],
  },
]
