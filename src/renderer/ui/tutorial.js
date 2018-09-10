import { blueprints } from '~/config/blueprints'
import { drawMachine } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { distance, pointEqual, pointToCell } from '~/service/point'
import { getPointer } from '~/util/pointer'
import type { Universe, Blueprint, Machine, UIstate } from '~/type'

const tutorials = [
  //0
  "Oh no, your sushi factory went offline!<br>&nbsp; Let's restart over shall we?",

  //1
  'See this guy over here?<br>&nbsp;Put him to work!',

  //2
  'Click on the little guy',

  //3
  'And point him the machine on top',

  //4
  0,

  //5
  'Look at that! He got a rice grain!',

  // 6
  'Make him carry that to the hungry customers<br> on the left',

  // 7
  'Select him again',

  // 8
  'Drag your mouse<br>from the collect point to the drop point',

  // 9
  0,

  // 10
  'Yeah money!',

  // 11
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
    container.onclick =
      container.onclick ||
      (e => {
        uistate.step++
        e.stopPropagation()
      })

    if ((step == 2 || step == 7) && uistate.command) uistate.step++

    if (step == 3 && universe.bots[0].command.type == 'activate') uistate.step++

    if (
      step == 3 &&
      !uistate.command &&
      universe.bots[0].command.type !== 'activate'
    )
      uistate.step--

    if (step == 4 && universe.droppedTokens[0]) {
      uistate.step++
      universe.bots[0].command.type = 'idle'
    }

    if (step == 6 && !universe.clients.length) {
      const w = getWidth(universe.map)

      universe.customers = [
        { cell: { x: w - 1, y: 4 } },
        { cell: { x: w - 1, y: 5 } },
        { cell: { x: w - 1, y: 6 } },
      ]

      universe.clients = Array.from({ length: 3 }).map((_, i) => ({
        id: '' + i,
        l: 0,
        client: ['A', 'B'][Math.floor(2 * Math.random())],
        position: {
          x: universe.customers[0].cell.x + 0.2 + i * 0.05 - 2,
          y: universe.customers[0].cell.y + 0.1 + i * 0.5 + 4,
        },
        velocity: { x: 0, y: 0 },
        command: { type: 'wander', target: universe.customers[0].cell },
        activity: { cooldown: 0 },
        navigation: null,
      }))
    }

    if (
      (step == 8 || step == 9) &&
      !uistate.command &&
      (universe.bots[0].command.type !== 'carry' ||
        !universe.customers.some(({ cell }) =>
          pointEqual(cell, pointToCell(universe.bots[0].command.dropCell))
        ))
    ) {
      if (universe.bots[0].command.type === 'activate')
        universe.bots[0].command.type = 'idle'
      uistate.step = 7
    }

    if (
      step == 8 &&
      (universe.bots[0].command.type === 'carry' &&
        universe.customers.some(({ cell }) =>
          pointEqual(cell, pointToCell(universe.bots[0].command.dropCell))
        ))
    ) {
      uistate.step++
    }

    if (
      step == 9 &&
      universe.droppedTokens[0] &&
      universe.customers.some(({ cell }) =>
        pointEqual(cell, pointToCell(universe.droppedTokens[0].position))
      )
    )
      uistate.step++

    if (uistate.step !== step) {
      step = uistate.step

      if ([0, 1, 5, 6, 10, 11].includes(step)) {
        tutorial.innerHTML = tutorials[step]
        container.style.display = 'flex'
      } else container.style.display = 'none'

      if ([2, 3, 7, 8].includes(step)) {
        hint.innerHTML = tutorials[step]
        hint.style.display = 'block'
      } else hint.style.display = 'none'
    }
  }

  return update
}
