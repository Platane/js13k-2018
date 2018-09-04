import type { Universe } from '~/type'
import { botMoving } from './botMoving'
import { machineProcessing } from './machineProcessing'
import { customerProcessing } from './customerProcessing'
import { botDecisionMaking } from './botDecisionMaking'
import { droppedTokensCoolDown } from './droppedTokensCoolDown'

export const tic = (universe: Universe) => {
  // dropped tokens
  droppedTokensCoolDown(universe)

  // bot logic
  botDecisionMaking(universe)

  // move bots
  botMoving(universe)

  // machines processing
  machineProcessing(universe)

  // customer processing
  customerProcessing(universe)
}
