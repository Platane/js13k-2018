import { blueprints } from '~/config/blueprints'
import { drawMachine } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { distance } from '~/service/point'
import { getPointer } from '~/util/pointer'
import type { Universe, Blueprint, Machine, UIstate } from '~/type'

const names = {
  'rice-grain-harvester': ['Rice Farm', 'Produces rice grain'],
  'rice-cooker': ['Rice Cooker', 'Cook raw rice grain'],
  'tuna-skin-workshop': ['Tuna Skin Workshop', 'Skin and cut tuna'],
  'tuna-fishing-spot': [
    'Tuna Fishing Spot',
    'A good spot to catch tuna, just lays you fishing rod and wait',
  ],
}

const createMachineList = onselect => {
  const container = document.createElement('div')
  container.style.cssText = 'width:120px;flex-shrink:0'

  blueprints.forEach(blueprint => {
    const item = document.createElement('div')
    item.style.cssText = 'padding:10px;cursor:pointer;font-size:12px;'

    item.innerText = names[blueprint.id][0]

    item.onclick = () => onselect(blueprint)

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
  window.document.ontouchend = window.document.onmouseup = () => (timestamp = 0)
  window.document.ontouchmove = window.document.onmousemove = e => {
    if (!timestamp) return

    const l = distance(getPointer(e), pointer)

    if (l > 10) {
      timestamp = 0
      callback()
    }
  }
}

const createMachineDecription = (onrotate, ondragstart) => {
  const container = document.createElement('div')
  container.style.cssText = 'padding:10px;background-color:#f3f3f3;flex-grow:1'
  container.onmousedown = e => e.stopPropagation()

  const name = document.createElement('div')
  name.style.cssText = 'margin-bottom:20px'
  container.appendChild(name)

  const description = document.createElement('div')
  description.style.cssText = 'font-size:14px'
  container.appendChild(description)

  const canvas = document.createElement('canvas')
  const l = (canvas.width = canvas.height = 100)
  canvas.style.cssText = `width:${l}px;height:${l}px;cursor:pointer`
  startdrag(canvas, ondragstart)
  container.appendChild(canvas)

  const rotateButton = document.createElement('button')
  rotateButton.style.cssText = 'font-size:14px'
  container.appendChild(rotateButton)
  rotateButton.innerText = 'rotate'
  rotateButton.onclick = onrotate

  container.update = (blueprint, machineRotation) => {
    const [n, d] = names[blueprint.id]

    name.innerText = n
    description.innerText = d

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, l, l)
    const dummyMachine: Machine = {
      id: 'a',
      positionOrigin: { x: 0, y: 0 },
      processing: null,
      rotation: machineRotation,
      blueprint,
    }

    const w = getWidth(blueprint.ground)
    const h = getHeight(blueprint.ground)
    const u = projMachine(dummyMachine)({ x: 0, y: 0 })
    const v = projMachine(dummyMachine)({ x: w - 1, y: h - 1 })
    const a = l / (Math.max(w, h) + 1)
    const camera = {
      a,
      t: { x: -Math.min(u.x, v.x) * a, y: -Math.min(u.y, v.y) * a },
    }

    drawMachine(ctx, camera, dummyMachine)
  }

  return container
}

export const create = (domParent: Element) => {
  const container = document.createElement('div')
  container.style.cssText =
    'position:fixed;padding:10px;background-color:#ddd;bottom:0;right:0;width:45%;font-size:16px;z-index:2'
  domParent.appendChild(container)

  const button = document.createElement('button')
  button.style.cssText =
    'padding:10px;border-radius:50%;width:40px;height:40px;border:none;background-color:blue'
  container.appendChild(button)

  const shopPanel = document.createElement('div')
  shopPanel.style.cssText =
    'position:absolute;min-width:300px;width:90%;right:10px;height:250px;background-color:#ddd;bottom:70px;border-radius:4px;transition:transform 180ms;transform-origin:2% 110%;transform:scale(0,0);display:flex;flex-direction:row;'
  container.appendChild(shopPanel)

  let machineList
  let machineDecription

  let selectedBlueprintBuyable = false
  let selectedBlueprintRotation = null
  let selectedBlueprintId = null
  let shopOpened = false

  const update = (universe: Universe, uistate: UIstate) => {
    // bind action
    button.onclick =
      button.onclick || (() => (uistate.shopOpened = !uistate.shopOpened))

    if (!machineList) {
      const onselect = blueprint => (uistate.selectedBlueprintId = blueprint.id)

      shopPanel.appendChild((machineList = createMachineList(onselect)))
    }
    if (!machineDecription) {
      const onrotate = () =>
        (uistate.selectedBlueprintRotation =
          (uistate.selectedBlueprintRotation + 3) % 4)

      const ondragstart = m => {
        const blueprint = blueprints.find(x => x.id === selectedBlueprintId)

        const machine: Machine | void = blueprint && {
          id: Math.random().toString(),
          rotation: uistate.selectedBlueprintRotation,
          positionOrigin: { x: -999, y: -999 },
          blueprint,
          processing: null,
        }

        uistate.dragMachine = machine
      }

      shopPanel.appendChild(
        (machineDecription = createMachineDecription(onrotate, ondragstart))
      )
    }

    // update ui
    //
    if (
      (!uistate.dragMachine && !uistate.command && uistate.shopOpened) !==
      shopOpened
    ) {
      shopOpened =
        !uistate.dragMachine && !uistate.command && uistate.shopOpened

      // if (!shopOpened) uistate.selectedBlueprintId = null

      shopPanel.style.transform = shopOpened ? null : 'scale(0,0)'
    }

    if (
      selectedBlueprintRotation !== uistate.selectedBlueprintRotation ||
      selectedBlueprintId !== uistate.selectedBlueprintId
    ) {
      selectedBlueprintRotation = uistate.selectedBlueprintRotation
      selectedBlueprintId = uistate.selectedBlueprintId

      const blueprint = blueprints.find(x => x.id === selectedBlueprintId)

      machineDecription.style.display = blueprint ? 'block' : 'none'

      if (blueprint)
        machineDecription.update(blueprint, selectedBlueprintRotation)
    }
  }

  return update
}
