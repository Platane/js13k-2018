import type { Universe } from '~/type'
import { botMoving } from './botMoving'
import { machinceProcessing } from './machinceProcessing'
import { botDecisionMaking } from './botDecisionMaking'

export const tic = (universe: Universe) => {
  // bot logic
  botDecisionMaking(universe)

  // move bots
  botMoving(universe)

  // machines processing
  machinceProcessing(universe)
}
