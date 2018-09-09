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
  element.ontouchstart = element.onmousedown = e => {
    timestamp = e.timeStamp
    pointer = getPointer(e)
  }

  const up = () => (timestamp = 0)
  const move = e => {
    if (!timestamp) return

    const l = distance(getPointer(e), pointer)

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
  const csize = (canvas.width = canvas.height = 100)
  canvas.style.cssText = `width:${csize}px;height:${csize}px;cursor:pointer`
  startdrag(canvas, ondragstart)
  container.appendChild(canvas)

  const rotateButton = document.createElement('button')
  rotateButton.style.cssText = 'font-size:14px'
  container.appendChild(rotateButton)
  rotateButton.innerText = 'rotate'
  rotateButton.onclick = onrotate

  container.update = (blueprintId, machineRotation) => {
    const [n, d] = names[blueprintId] || blueprintId

    name.innerText = n
    description.innerText = d

    const blueprint = blueprints.find(b => b.id === blueprintId)

    canvas.style.display = 'none'
    rotateButton.style.display = 'none'

    if (blueprint) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, csize, csize)

      const b = boxes['machine' + blueprint.id]

      const w = getWidth(blueprint.ground)
      const h = getHeight(blueprint.ground)
      const r = Math.min(w, h)

      ctx.save()
      ctx.scale(csize, csize)
      ctx.translate(0.5, 0.5)
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

      canvas.style.display = 'block'
      rotateButton.style.display = 'block'
    } else if (blueprintId === 'bot') {
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
    'position:absolute;min-width:360px;width:90%;right:10px;height:250px;background-color:#ddd;bottom:70px;border-radius:4px;transition:transform 180ms;transform-origin:2% 110%;transform:scale(0,0);display:flex;flex-direction:row;'
  container.appendChild(shopPanel)

  const closeButton = document.createElement('button')
  closeButton.style.cssText =
    'padding:4px 10px;position:absolute;top:2px;right:2px;z-index:3;background-color:transparent;border:none'
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
      button.style.display = step < 13 ? 'none' : 'block'
    }
  }

  return update
}
