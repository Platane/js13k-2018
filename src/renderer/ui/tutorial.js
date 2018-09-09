import { blueprints } from '~/config/blueprints'
import { drawMachine } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { distance } from '~/service/point'
import { getPointer } from '~/util/pointer'
import type { Universe, Blueprint, Machine, UIstate } from '~/type'

const tutorials = [
  "Oh no, your sushi factory went offline!<br>&nbsp; Let's restart over shall we?",
  'See this guy over here?<br>&nbsp;Put him to work!',
  'Click on the little guy',
  'Now click the command button',
  'And point him the machine on top',
  0,
  'Look at that! He got a rice grain!',
  'Make him carry that to the hungry customer',
  'Click on the command button again',
  'Drag your mouse<br>from the collect point to the drop point',
  0,
  0,
  'Yeah money!',
  'Keep going<br>You can recruit crew and build new machines from the shop<br>&nbsp; Look up for new recipes',
]

export const create = (domParent: Element) => {
  const container = document.createElement('div')
  container.style.cssText =
    'position:fixed;top:0;left:0;right:0;bottom:0;background-color:#000d;transition:background-color 200ms;display:flex;justify-content:center;align-items:center;z-index:3'
  domParent.appendChild(container)

  const tutorial = document.createElement('div')
  tutorial.style.cssText =
    'color:#fff;font-size:24px;line-height:40px;letter-spacing:1.4px;padding:0 10%'
  container.appendChild(tutorial)

  const hint = document.createElement('div')
  hint.style.cssText =
    'position:fixed;right:10px;bottom:60px;color:#000;font-size:24px;line-height:40px;letter-spacing:1.4px;z-index:3'
  domParent.appendChild(hint)

  let step = -1

  const update = (universe: Universe, uistate: UIstate) => {
    container.onclick = container.onclick || (() => uistate.step++)

    if (step == 2 && uistate.selectedBotId) uistate.step++

    if ((step == 3 || step == 8) && uistate.command) uistate.step++

    if (step == 4 && universe.bots[0].command.type == 'activate') uistate.step++

    if (step == 5 && universe.droppedTokens[0]) {
      uistate.step++
      universe.bots[0].command.type = 'idle'
    }

    if (step == 9 && universe.bots[0].command.type == 'carry') uistate.step++

    if (step == 10 && universe.bots[0].activity.carrying) uistate.step++

    if (step == 11 && !universe.bots[0].activity.carrying) uistate.step++

    if (uistate.step !== step) {
      step = uistate.step

      if ([0, 1, 6, 7, 12, 13].includes(step)) {
        tutorial.innerHTML = tutorials[step]
        container.style.display = 'flex'
      } else container.style.display = 'none'

      if ([2, 3, 4, 8, 9].includes(step)) {
        hint.innerHTML = tutorials[step]
        hint.style.display = 'block'
      } else hint.style.display = 'none'
    }
  }

  return update
}
