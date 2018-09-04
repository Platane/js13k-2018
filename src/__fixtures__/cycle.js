import { blueprints } from '~/config/blueprints'
import { menu } from '~/config/menu'
import type { Universe, UIstate } from '~/type'

export const universe: Universe = {
  bank: 10,

  map: `
############################
#...................#......#
#..#........#######.#......#
#...............#...#......#
#...............#.###......#
#...............#..........#
#.....################.....#
#.....#....................#
#.....#....................#
#.....#.....#...######.....#
#.....#.....#...#....#.....#
#.....#.....#...#.#..#.....#
#.....#.....#...#..........#
#...........#...#..........#
#...........#...#######....#
#...........#..............#
#...........#..............#
#...........#..............#
############################
`
    .trim()
    .split('\n')
    .map(line => line.split('').map(x => (x === '#' ? 1 : 0))),

  bots: [
    {
      id: '12',
      velocity: { x: 0, y: 0 },
      position: { x: 5.5, y: 2.2 },
      command: {
        type: 'carry',
        pickUpCell: { x: 8, y: 3 },
        dropCell: { x: 13, y: 13 },
      },
      activity: { carrying: null },
    },
    {
      id: '122',
      velocity: { x: 0, y: 0 },
      position: { x: 5.5, y: 2.4 },
      command: {
        type: 'carry',
        pickUpCell: { x: 13, y: 13 },
        dropCell: { x: 25, y: 7 },
      },
      activity: { carrying: null },
    },

    {
      id: '15',
      velocity: { x: 0, y: 0 },
      position: { x: 5.5, y: 2.6 },
      command: {
        type: 'carry',
        pickUpCell: { x: 25, y: 7 },
        dropCell: { x: 2, y: 2 },
      },
      activity: { carrying: null },
    },

    {
      id: '112',
      velocity: { x: 0, y: 0 },
      position: { x: 5.5, y: 2.8 },
      command: {
        type: 'activate',
        targetId: '5',
      },
      activity: { activationCooldown: 0 },
    },

    {
      id: '1312',
      velocity: { x: 0, y: 0 },
      position: { x: 5.7, y: 2.8 },
      command: {
        type: 'activate',
        targetId: '2',
      },
      activity: { activationCooldown: 0 },
    },
    {
      id: '1qwe312',
      velocity: { x: 0, y: 0 },
      position: { x: 22.7, y: 2.8 },
      command: {
        type: 'activate',
        targetId: '2',
      },
      activity: { activationCooldown: 0 },
    },

    {
      id: '13112',
      velocity: { x: 0, y: 0 },
      position: { x: 2.7, y: 2.8 },
      command: {
        type: 'carry',
        pickUpCell: { x: 4, y: 2 },
        dropCell: { x: 18, y: 12 },
      },
      activity: { carrying: null },
    },
    {
      id: '13312',
      velocity: { x: 0, y: 0 },
      position: { x: 2.2, y: 2.8 },
      command: {
        type: 'carry',
        pickUpCell: { x: 18, y: 10 },
        dropCell: { x: 8, y: 3 },
      },
      activity: { carrying: null },
    },

    // ...Array.from({ length: 9 }).map((_, i) => ({
    //   id: `i${i}`,
    //
    //   position: { x: 3.5 + (i % 2) * 0.03, y: 4.2 + i * 0.3 },
    //   velocity: { x: 0, y: 0 },
    //
    //   command: { type: 'idle' },
    //   navigation: null,
    //   activity: null,
    // })),
  ],

  machines: [
    {
      id: '2',

      blueprint: {
        id: '3',
        ground: [[0, 1, 0]],
        buildingCost: 0,
        activationThreshold: 20,
        inputs: [{ cell: { x: 0, y: 0 }, token: 'yellow' }],
        outputs: [{ cell: { x: 2, y: 0 }, token: 'purple' }],
        recipe: {
          inputs: [{ token: 'yellow', n: 1 }],
          outputs: [{ token: 'purple', n: 1 }],
        },
      },

      rotation: 1,
      positionOrigin: { x: 2, y: 2 },

      processing: null,
    },
    {
      id: '5',

      blueprint: {
        id: '13',
        ground: [[0, 1, 0]],
        buildingCost: 0,
        activationThreshold: 20,
        inputs: [{ cell: { x: 0, y: 0 }, token: 'purple' }],
        outputs: [{ cell: { x: 2, y: 0 }, token: 'yellow' }],
        recipe: {
          inputs: [{ token: 'purple', n: 1 }],
          outputs: [{ token: 'yellow', n: 1 }],
        },
      },

      rotation: 2,
      positionOrigin: { x: 18, y: 12 },

      processing: null,
    },
  ],

  menu,

  customers: [],

  droppedTokens: [
    { position: { x: 8.3, y: 3.5 }, token: 'yellow', availableCoolDown: 0 },
    { position: { x: 8.1, y: 3.2 }, token: 'yellow', availableCoolDown: 0 },
    { position: { x: 8.6, y: 3.7 }, token: 'yellow', availableCoolDown: 0 },
    { position: { x: 8.7, y: 3.2 }, token: 'yellow', availableCoolDown: 0 },
    { position: { x: 14.3, y: 3.57 }, token: 'blue', availableCoolDown: 0 },
  ],

  blueprints: [],
}
