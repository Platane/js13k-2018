import type { Universe } from '~/type'
import { botMoving } from './botMoving'
import { botDecision } from './botDecision'

export const tic = (universe: Universe) => {
  // bot logic
  botDecision(universe)

  // move bots
  botMoving(universe)
}
