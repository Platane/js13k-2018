import test from 'tape'
import { getClosestPointToMachine, proj } from '../index'
import { setCell, getWidth, getHeight, isNavigable } from '~/service/map'
import type { Machine } from '~/type'

test('getClosestPointToMachine', t => {
  const machine: Machine = {
    id: '1',
    processing: null,
    positionOrigin: { x: 4, y: 2 },
    rotation: 2,
    activationCooldown: 10,
    blueprint: {
      id: '1',
      buildingCost: 1,
      activationThreshold: 10,
      ground: [[1, 1]],
      inputs: [],
      outputs: [],
      recipe: {
        inputs: [],
        outputs: [],
      },
    },
  }

  const map = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]

  for (let x = getWidth(machine.blueprint.ground); x--; )
    for (let y = getHeight(machine.blueprint.ground); y--; )
      if (!isNavigable(machine.blueprint.ground, { x, y }))
        setCell(map, proj(machine)({ x, y }), 1)

  const p = getClosestPointToMachine(map, machine, { x: 0, y: 0 })

  t.assert(p, 'should at least not crash')

  t.end()
})
