import { blueprints } from '~/config/blueprints'
// import { drawMachine } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { distance } from '~/service/point'
import { getPointer } from '~/util/pointer'
import { boxes, texture, l as texl } from '~/renderer/texture'
import type { Universe, Blueprint, Machine, UIstate } from '~/type'

const names = {
  bot: [
    'Worker',
    'Workers are much needed to carry resources and activate the machines',
  ],
  'rice-grain-harvester': ['Rice Farm', 'Produces rice grain'],
  'rice-cooker': ['Rice Cooker', 'Cook raw rice grain'],
  'tuna-skin-workshop': ['Tuna Skin Workshop', 'Skin and cut tuna'],
  'tuna-fishing-spot': [
    'Tuna Fishing Spot',
    'A good spot to catch tuna, just lays you fishing rod and wait',
  ],
}

const createMachineList = (onselect, ondragstart) => {
  const container = document.createElement('div')
  container.style.cssText = 'width:120px;flex-shrink:0'

  //
  ;[{ id: 'bot' }, ...blueprints].forEach(blueprint => {
    const item = document.createElement('div')
    item.style.cssText = 'padding:10px;cursor:pointer;font-size:12px;'

    item.innerText = (names[blueprint.id] || blueprint.id)[0]

    item.onclick = () => onselect(blueprint)
    startdrag(item, () => ondragstart(blueprint.id))

    container.appendChild(item)
  })

  return container
}

const startdrag = (element, callback) => {
  let timestamp = 0
  let pointer = null

  let supportPointerEvent = false

  element.ontouchstart = element.onmousedown = e => {
    // some devices ( my s4 ) support both mouseevent and pointerevent
    // de-dup event
    if (!e.touches) {
      if (supportPointerEvent) return
    } else supportPointerEvent = true

    timestamp = e.timeStamp
    pointer = getPointer(e)
  }

  const up = e => {
    if (!e.touches) {
      if (supportPointerEvent) return
    } else supportPointerEvent = true

    timestamp = 0
  }
  const move = e => {
    if (!e.touches) {
      if (supportPointerEvent) return
    } else supportPointerEvent = true

    if (!timestamp || !pointer) return

    const l = distance(pointer, getPointer(e))

    if (l > 10) {
      timestamp = 0
      callback()
    }
  }
  window.document.addEventListener('touchend', up)
  window.document.addEventListener('mouseup', up)
  window.document.addEventListener('touchmove', move)
  window.document.addEventListener('mousemove', move)
}

const createMachineDecription = (onrotate, ondragstart) => {
  const container = document.createElement('div')
  container.style.cssText = 'padding:10px;background-color:#f3f3f3;flex-grow:1'

  const name = document.createElement('div')
  name.style.cssText = 'margin-bottom:20px'
  container.appendChild(name)

  const description = document.createElement('div')
  description.style.cssText = 'font-size:14px'
  container.appendChild(description)

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 100
  canvas.style.cssText = `width:100px;height:100px;cursor:pointer`
  const ctx = canvas.getContext('2d')
  ctx.scale(100, 100)
  ctx.translate(0.5, 0.5)
  startdrag(canvas, ondragstart)
  container.appendChild(canvas)

  const rotateButton = document.createElement('button')
  rotateButton.style.cssText =
    'font-size:14px;position:relative;top:-14px;left:-4px'
  container.appendChild(rotateButton)
  rotateButton.innerText = '↻'
  rotateButton.onclick = onrotate

  const recipe = document.createElement('canvas')
  recipe.width = 220
  recipe.height = 50
  recipe.style.cssText = `width:220px;height:50px`
  const rctx = recipe.getContext('2d')
  rctx.scale(50, 50)
  rctx.translate(0, 0.5)
  container.appendChild(recipe)

  container.update = (blueprintId, machineRotation) => {
    const [n, d] = names[blueprintId] || blueprintId

    name.innerText = n
    description.innerText = d

    const blueprint = blueprints.find(b => b.id === blueprintId)

    recipe.style.display = 'none'
    canvas.style.display = 'none'
    rotateButton.style.display = 'none'

    ctx.clearRect(-1, -1, 2, 2)
    rctx.clearRect(-1, -1, 10, 10)

    if (blueprint) {
      // ground
      const b = boxes['machine' + blueprint.id]

      const w = getWidth(blueprint.ground)
      const h = getHeight(blueprint.ground)
      const r = Math.min(w, h)

      ctx.save()
      ctx.rotate(((machineRotation % 4) * Math.PI) / 2)
      ctx.drawImage(
        texture,
        b[0] * texl,
        b[1] * texl,
        (b[2] - b[0]) * texl,
        (b[5] - b[1]) * texl,

        -0.5,
        -0.5,
        r / w,
        r / h
      )
      ctx.restore()

      // recipe

      const drawToken = arr =>
        arr.forEach(({ token, n }) => {
          const b = boxes[token]

          Array.from({ length: n }).map(() => {
            const s = 0.6

            rctx.translate(0.4, 0)
            rctx.drawImage(
              texture,
              b[0] * texl,
              b[1] * texl,
              (b[2] - b[0]) * texl,
              (b[5] - b[1]) * texl,

              -s / 2,
              -s / 2,
              s,
              s
            )

            rctx.fillStyle = '#ddd'
            rctx.beginPath()
            rctx.arc(0, 0, 0.4, 0, Math.PI * 2)
            rctx.fill()
          })

          rctx.translate(0.45, 0)
        })
      rctx.save()
      rctx.globalCompositeOperation = 'destination-over'
      rctx.translate(0.05, 0)
      drawToken(blueprint.recipe.inputs)
      rctx.translate(0.15, 0)
      {
        rctx.save()
        rctx.rotate(Math.PI / 2)
        const s = 0.4
        const b = boxes['arrow_input']
        rctx.drawImage(
          texture,
          b[0] * texl,
          b[1] * texl,
          (b[2] - b[0]) * texl,
          (b[5] - b[1]) * texl,

          -s / 2,
          -s / 2,
          s,
          s
        )
        rctx.restore()
      }
      rctx.translate(0.3, 0)
      drawToken(blueprint.recipe.outputs)
      rctx.restore()

      //
      recipe.style.display = 'block'
      canvas.style.display = 'block'
      rotateButton.style.display = 'block'
    } else if (blueprintId === 'bot') {
      const b = boxes['bot' + 0]

      ctx.drawImage(
        texture,
        b[0] * texl,
        b[1] * texl,
        (b[2] - b[0]) * texl,
        (b[5] - b[1]) * texl,

        -0.3,
        -0.3,
        0.6,
        0.6
      )

      canvas.style.display = 'block'
    }
  }

  return container
}

export const create = (domParent: Element) => {
  const container = document.createElement('div')
  container.style.cssText =
    'position:fixed;padding:10px;background-color:#ddd;bottom:0;right:0;width:45%;font-size:16px;z-index:2;border-radius:20px 0 0 0;display:flex;flex-direction:row'
  container.ontouchstart = container.onmousedown = e => e.stopPropagation()
  domParent.appendChild(container)

  const button = document.createElement('button')
  button.style.cssText =
    'padding:10px;border-radius:50%;width:40px;height:40px;border:none;background-color:blue'
  container.appendChild(button)

  const bankAccount = document.createElement('div')
  bankAccount.style.cssText = 'padding:10px;margin-left:auto;'
  container.appendChild(bankAccount)

  const shopPanel = document.createElement('div')
  shopPanel.style.cssText =
    'position:absolute;min-width:380px;width:90%;right:10px;height:250px;background-color:#ddd;bottom:70px;border-radius:4px;transition:transform 180ms;transform-origin:2% 110%;transform:scale(0,0);display:flex;flex-direction:row;'
  container.appendChild(shopPanel)

  const closeButton = document.createElement('button')
  closeButton.style.cssText =
    'font-size:30px;padding:4px 10px;position:absolute;top:2px;right:2px;z-index:3;background-color:transparent;border:none'
  closeButton.innerText = '×'

  shopPanel.appendChild(closeButton)

  let machineList
  let machineDecription

  let selectedBlueprintBuyable = false
  let selectedBlueprintRotation = null
  let selectedBlueprintId = null
  let shopOpened = false
  let bank = -1
  let step = -1

  const update = (universe: Universe, uistate: UIstate) => {
    // bind action
    button.onclick =
      button.onclick || (() => (uistate.shopOpened = !uistate.shopOpened))

    closeButton.onclick =
      closeButton.onclick || (() => (uistate.shopOpened = false))

    if (!machineDecription) {
      const onrotate = () =>
        (uistate.selectedBlueprintRotation =
          (uistate.selectedBlueprintRotation + 3) % 4)

      const ondragstart = s => {
        uistate.selectedBlueprintId = s || uistate.selectedBlueprintId

        const blueprint = blueprints.find(
          x => x.id === uistate.selectedBlueprintId
        )

        const machine: Machine | void = blueprint && {
          id: Math.random().toString(),
          rotation: uistate.selectedBlueprintRotation,
          positionOrigin: { x: -999, y: -999 },
          blueprint,
          processing: null,
        }

        uistate.dragMachine = machine

        uistate.dragBot = uistate.selectedBlueprintId === 'bot' && {
          id: Math.random().toString(),
          position: { x: -999, y: -999 },
          velocity: { x: 0, y: 0 },
          l: 0,
          command: { type: 'idle' },
          navigation: null,
          activity: null,
        }
      }

      const onselect = blueprint => (uistate.selectedBlueprintId = blueprint.id)

      shopPanel.appendChild(
        (machineList = createMachineList(onselect, ondragstart))
      )

      shopPanel.appendChild(
        (machineDecription = createMachineDecription(onrotate, ondragstart))
      )
    }

    // update ui
    //
    if (
      (!uistate.dragBot &&
        !uistate.dragMachine &&
        !uistate.command &&
        uistate.shopOpened) !== shopOpened
    ) {
      shopOpened =
        !uistate.dragBot &&
        !uistate.dragMachine &&
        !uistate.command &&
        uistate.shopOpened

      // if (!shopOpened) uistate.selectedBlueprintId = null

      shopPanel.style.transform = shopOpened ? null : 'scale(0,0)'
    }

    if (bank !== universe.bank) {
      bank = universe.bank
      bankAccount.innerText = universe.bank
    }

    if (
      selectedBlueprintRotation !== uistate.selectedBlueprintRotation ||
      selectedBlueprintId !== uistate.selectedBlueprintId
    ) {
      selectedBlueprintRotation = uistate.selectedBlueprintRotation
      selectedBlueprintId = uistate.selectedBlueprintId

      machineDecription.update(
        uistate.selectedBlueprintId,
        selectedBlueprintRotation
      )
    }

    if (uistate.step !== step) {
      step = uistate.step
      button.style.display = step < 12 ? 'none' : 'block'
    }
  }

  return update
}
