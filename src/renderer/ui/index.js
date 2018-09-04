import { create as createBotStatus } from './botStatus'
import { create as createTutorial } from './tutorial'
import { create as createShop } from './shop'
import type { Universe, UIstate } from '~/type'

export const createUI = (domParent: Element) => {
  const updateBot = createBotStatus((domParent: Element))
  const updateShop = createShop((domParent: Element))
  // const updateTutorial = createTutorial((domParent: Element))

  return (universe: Universe, uistate: UIstate) => {
    updateBot(universe, uistate)
    updateShop(universe, uistate)
    // updateTutorial(universe, uistate)
  }
}
