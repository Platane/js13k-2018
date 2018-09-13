import type { Universe } from '~/type'
import { botMoving } from './botMoving'
import { machineProcessing } from './machineProcessing'
import { customerProcessing } from './customerProcessing'
import { botDecisionMaking } from './botDecisionMaking'

export const tic = (universe: Universe) => {
  // dropped tokens
  universe.droppedTokens.forEach(dt => {
    if (dt.availableCoolDown > 0) dt.availableCoolDown--
  })

  // bot logic
  botDecisionMaking(universe)

  // move bots
  botMoving(universe)

  // machines processing
  machineProcessing(universe)

  // customer processing
  customerProcessing(universe)
}
