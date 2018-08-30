import { create as createBotStatus } from './botStatus'
import { create as createShop } from './shop'
import type { Universe, UIstate } from '~/type'

export const createUI = (domParent: Element) => {
  const updateBot = createBotStatus((domParent: Element))
  const updateShop = createShop((domParent: Element))

  return (universe: Universe, uistate: UIstate) => {
    updateBot(universe, uistate)
    updateShop(universe, uistate)
  }
}
