import type { Universe } from '~/type'

export const droppedTokensCoolDown = ({ droppedTokens }: Universe) =>
  droppedTokens.forEach(dt => {
    if (dt.availableCoolDown > 0) dt.availableCoolDown--
  })
