import { pointToCell, pointEqual } from '~/service/point'
import { DROPPED_DELAY } from '~/config'
import type { Universe } from '~/type'

export const customerProcessing = (universe: Universe) =>
  universe.customers.forEach(({ cell }) => {
    for (let i = universe.droppedTokens.length; i--; ) {
      const { token, position, availableCoolDown } = universe.droppedTokens[i]

      if (
        universe.menu[token] &&
        availableCoolDown <= 0 &&
        pointEqual(pointToCell(position), cell)
      ) {
        universe.droppedTokens.splice(i, 1)

        universe.bank += universe.menu[token]
      }
    }
  })
