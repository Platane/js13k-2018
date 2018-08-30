import { blueprints } from '~/config/blueprints'
import { drawMachine } from '~/renderer/canvas'
import { getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
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

const createMachineDecription = (onrotate, onstartdrag) => {
  const container = document.createElement('div')
  container.style.cssText = 'padding:10px;background-color:#f3f3f3;flex-grow:1'

  const name = document.createElement('div')
  name.style.cssText = 'margin-bottom:20px'
  container.appendChild(name)

  const description = document.createElement('div')
  description.style.cssText = 'font-size:14px'
  container.appendChild(description)

  const canvas = document.createElement('canvas')
  const l = (canvas.width = canvas.height = 100)
  canvas.style.cssText = `width:${l}px;height:${l}px`
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
    'position:absolute;min-width:300px;width:90%;right:10px;min-height:300px;background-color:#ddd;bottom:80px;border-radius:4px;transition:transform 200ms;transform-origin:2% 110%;transform:scale(0,0);display:flex;flex-direction:row;'

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

      shopPanel.appendChild(
        (machineDecription = createMachineDecription(onrotate))
      )
    }

    // update ui
    //
    if (uistate.shopOpened !== shopOpened) {
      shopOpened = uistate.shopOpened

      if (!shopOpened) uistate.selectedBlueprintId = null

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
