import { blueprints } from '~/config/blueprints'
import { menu } from '~/config/menu'
import { getWidth, getHeight, setCell, isNavigable } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import type { Universe, UIstate } from '~/type'

const w = 20
const h = 18

const map = Array.from({ length: h }).map(() =>
  Array.from({ length: w }).map(() => 0)
)

const machines = [
  {
    positionOrigin: { x: 4, y: 3 },
    rotation: 0,
    blueprint: blueprints[1],
  },
  {
    positionOrigin: { x: 8, y: 5 },
    rotation: 1,
    blueprint: blueprints[1],
  },
  {
    positionOrigin: { x: 13, y: 4 },
    rotation: 2,
    blueprint: blueprints[1],
  },
  {
    positionOrigin: { x: 16, y: 3 },
    rotation: 3,
    blueprint: blueprints[1],
  },

  {
    positionOrigin: { x: 4, y: 7 },
    rotation: 0,
    blueprint: blueprints[2],
  },
  {
    positionOrigin: { x: 7, y: 10 },
    rotation: 1,
    blueprint: blueprints[2],
  },
  {
    positionOrigin: { x: 13, y: 10 },
    rotation: 2,
    blueprint: blueprints[2],
  },
  {
    positionOrigin: { x: 17, y: 8 },
    rotation: 3,
    blueprint: blueprints[2],
  },

  {
    positionOrigin: { x: 4, y: 12 },
    rotation: 0,
    blueprint: blueprints[3],
  },
  {
    positionOrigin: { x: 7, y: 15 },
    rotation: 1,
    blueprint: blueprints[3],
  },
  {
    positionOrigin: { x: 14, y: 16 },
    rotation: 2,
    blueprint: blueprints[3],
  },
  {
    positionOrigin: { x: 19, y: 13 },
    rotation: 3,
    blueprint: blueprints[3],
  },
].map((m, i) => Object.assign(m, { id: '-' + i, processing: null }))

machines.forEach(m => {
  const p = projMachine(m)

  const w = getWidth(m.blueprint.ground)
  const h = getHeight(m.blueprint.ground)

  for (let x = w; x--; )
    for (let y = h; y--; )
      if (!isNavigable(m.blueprint.ground, { x, y }))
        setCell(map, p({ x, y }), 1)

        //
  ;[...m.blueprint.outputs, ...m.blueprint.inputs].every(({ cell }) =>
    setCell(map, p(cell), 2)
  )
})

export const universe: Universe = {
  bank: 100000,

  map,

  bots: [],

  menu,

  blueprints,

  customers: [
    { cell: { x: w - 2, y: 4 } },
    { cell: { x: w - 2, y: 5 } },
    { cell: { x: w - 2, y: 6 } },
  ],

  machines,

  droppedTokens: [],

  blueprints: [],
}
