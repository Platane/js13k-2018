import { botCarrierDecision } from './carrier'
import type { Universe } from '~/type'

export const botDecisionMaking = (universe: Universe) =>
  universe.bots.forEach(
    bot => bot.command.type === 'carry' && botCarrierDecision(universe, bot)
  )
