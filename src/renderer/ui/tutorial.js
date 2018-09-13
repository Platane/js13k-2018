import { blueprints } from '~/config/blueprints'
import { drawMachine } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { distance, pointEqual, pointToCell } from '~/service/point'
import { getPointer } from '~/util/pointer'
import { salmon_pink } from '~/config/palette'
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
  'Draw a path<br>from the collect point to the drop point',

  // 9
  0,

  // 10
  'Well done!',

  // 11
  'Keep going<br>You can recruit crew and build new machines from the shop<br>&nbsp; Look up for new recipes',
]

const container = document.getElementById('element-overlay')
const tutorial = document.getElementById('element-overlayTutorial')
const hint = document.getElementById('element-hint')

// hint.style.color = salmon_pink

let step
let shopOpened

export const updateTutorial = (universe: Universe, uistate: UIstate) => {
  container.ontouchstart = container.onmousedown =
    container.onmousedown ||
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

    universe.clients = Array.from({ length: 8 }).map((_, i) => ({
      id: '' + i,
      l: 0,
      client: ['A', 'B'][Math.floor(2 * Math.random())],
      position: {
        x: universe.customers[0].cell.x + 0.2 + i * 0.05 - 2,
        y: universe.customers[0].cell.y + 0.1 + i * 0.05 + 4,
      },
      velocity: { x: 0, y: 0 },
      command: { type: 'wander', target: universe.customers[0].cell },
      activity: { cooldown: 0 },
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

  //
  const so =
    !uistate.dragBot &&
    !uistate.dragMachine &&
    !uistate.command &&
    !!uistate.shopOpened

  if (shopOpened !== so) {
    shopOpened = so
    hint.style.transform = shopOpened
      ? 'translate3d(0,-280px,0)'
      : 'translate3d(0,-60px,0)'

    if (step >= 12) {
      hint.innerText = 'drag and drop machine or worker'
      hint.style.display =
        shopOpened && universe.bots.length + universe.machines.length < 4
          ? 'block'
          : 'none'
    }
  }

  //
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
