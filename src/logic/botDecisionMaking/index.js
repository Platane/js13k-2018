import { botActivatorDecision } from './activator'
import { botCarrierDecision } from './carrier'
import type { Universe } from '~/type'

export const botDecisionMaking = (universe: Universe) =>
  universe.bots.forEach(bot => {
    switch (bot.command.type) {
      case 'carry':
        return botCarrierDecision(universe, bot)
      case 'activate':
        return botActivatorDecision(universe, bot)
    }
  })
