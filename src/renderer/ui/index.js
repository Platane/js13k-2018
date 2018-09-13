import { blueprints } from '~/config'
import { getWidth, getHeight } from '~/service/map'
import { proj as projMachine } from '~/service/machine'
import { distance } from '~/service/point'
import { getPointer } from '~/util/pointer'
import { boxes, texture, l as texl } from '~/renderer/texture'
import { BOT_COST } from '~/config'
import { texture_arrow_output_box } from '~/renderer/texture/svg/arrow'
import type { Universe, Blueprint, Machine, UIstate } from '~/type'

/**
 * grab elements
 */

const domToolbar = document.getElementById('element-toolbar')
const domShopButton = document.getElementById('element-shopButton')
const domCancel = document.getElementById('element-cancel')

const domBank = document.getElementById('element-bank')
const domShopPanel = document.getElementById('element-shopPanel')
const domBlueprintList = document.getElementById('element-blueprintList')

const domCloseShopButton = document.getElementById('element-closeShopButton')

const domBlueprintName = document.getElementById('element-blueprintName')
const domBlueprintCost = document.getElementById('element-blueprintCost')
const domBlueprintImage = document.getElementById('element-blueprintImage')
const domBlueprintRecipe = document.getElementById('element-blueprintRecipe')

const domBlueprintRotate = document.getElementById('element-blueprintRotate')

const rctx = domBlueprintRecipe.getContext('2d')
rctx.scale(50, 50)
rctx.translate(0, 0.5)

const ctx = domBlueprintImage.getContext('2d')
ctx.scale(100, 100)
ctx.translate(0.5, 0.5)

/**
 * helper
 */

const drawMachineInImage = (blueprint, buildable, machineRotation) => {
  const b = boxes[blueprint.id]

  const w = getWidth(blueprint.ground)
  const h = getHeight(blueprint.ground)
  const r = Math.min(w, h)

  ctx.save()
  ctx.filter = buildable ? null : 'grayscale(100%)'
  ctx.rotate((((4 - machineRotation) % 4) * Math.PI) / 2)
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

        rctx.fillStyle = '#aaa'
        rctx.beginPath()
        rctx.arc(0, 0, 0.4, 0, Math.PI * 2)
        rctx.fill()
      })

      rctx.translate(0.45, 0)
    })
  rctx.save()
  rctx.filter = buildable ? null : 'grayscale(100%)'
  rctx.globalCompositeOperation = 'destination-over'
  rctx.translate(0.05, 0)
  drawToken(blueprint.recipe.inputs)
  rctx.translate(0.15, 0)
  {
    rctx.save()
    rctx.rotate(Math.PI / 2)
    const s = 0.4
    const b = texture_arrow_output_box
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

let init
let bank
let shopOpened
let botCommand
let machineRotation
let selectedBlueprintId
let selectedBlueprintRotation
let shopReady

export const updateUi = (universe: Universe, uistate: UIstate) => {
  if (!init) {
    init = 1

    /**
     * handlers
     */

    domBlueprintRotate.onclick = () =>
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
      }

      if (
        (blueprint && blueprint.buildingCost > universe.bank) ||
        (uistate.selectedBlueprintId === 'Worker' && BOT_COST > universe.bank)
      )
        return

      uistate.dragMachine = machine

      uistate.dragBot = uistate.selectedBlueprintId === 'Worker' && {
        id: Math.random().toString(),
        position: { x: -999, y: -999 },
        velocity: { x: 0, y: 0 },
        l: 0,
        command: { type: 'idle' },
      }
    }

    startdrag(domBlueprintImage, ondragstart)

    domCancel.onclick = () => {
      uistate.selectedBotId = null
      uistate.command = null
    }

    domShopButton.onclick = () => (uistate.shopOpened = true)
    domCloseShopButton.onclick = () => (uistate.shopOpened = false)

    // stop propagation
    domShopPanel.onmousedown = domShopPanel.ontouchstart = domToolbar.ontouchstart = domToolbar.onmousedown = e =>
      e.stopPropagation()

    /**
     * blueprint list
     */
    ;[{ id: 'Worker' }, ...blueprints].forEach(blueprint => {
      const item = document.createElement('div')
      item.style.cssText = 'padding:10px;cursor:pointer;'

      item.innerText = blueprint.id

      item.onclick = () => (uistate.selectedBlueprintId = blueprint.id)
      startdrag(item, () => ondragstart(blueprint.id))

      domBlueprintList.appendChild(item)
    })
  }

  /**
   * update shop opened
   */
  const so =
    !uistate.dragBot &&
    !uistate.dragMachine &&
    !uistate.command &&
    !!uistate.shopOpened

  const bc = uistate.command
  const sr = uistate.step >= 12

  if (shopOpened !== so || botCommand != bc || shopReady != sr) {
    shopOpened = so
    botCommand = bc
    shopReady = sr

    domShopPanel.style.transform = shopOpened ? null : 'scale(0,0)'
    domToolbar.style.transform = shopOpened ? 'translate3d(0,100px,0)' : null

    domBank.style.display = domShopButton.style.display =
      botCommand || !sr ? 'none' : 'block'
    domCancel.style.display = botCommand ? 'block' : 'none'
  }

  /**
   * update shop description
   */
  if (
    bank !== universe.bank ||
    selectedBlueprintRotation != uistate.selectedBlueprintRotation ||
    selectedBlueprintId != uistate.selectedBlueprintId
  ) {
    // update bank
    domBank.innerText = '$' + (bank = universe.bank)

    // update name
    domBlueprintName.innerText = selectedBlueprintId =
      uistate.selectedBlueprintId

    // blue print
    const blueprint = blueprints.find(b => b.id === selectedBlueprintId)

    domBlueprintRecipe.style.display = 'none'
    domBlueprintImage.style.display = 'none'
    domBlueprintRotate.style.display = 'none'

    ctx.clearRect(-1, -1, 2, 2)
    rctx.clearRect(-1, -1, 10, 10)
    ctx.save()

    if (blueprint) {
      domBlueprintCost.innerText = '$' + blueprint.buildingCost

      const buildable = blueprint.buildingCost <= bank
      domBlueprintCost.style.opacity = buildable ? 1 : 0.3
      domBlueprintCost.style.textDecoration = buildable ? null : 'line-through'

      // ground
      drawMachineInImage(
        blueprint,
        buildable,
        (selectedBlueprintRotation = uistate.selectedBlueprintRotation)
      )

      // display
      domBlueprintRecipe.style.display = 'block'
      domBlueprintImage.style.display = 'block'
      domBlueprintRotate.style.display = 'block'
    } else if (selectedBlueprintId === 'Worker') {
      const b = boxes['texture_bot' + 0]

      domBlueprintCost.innerText = '$' + BOT_COST

      const buildable = BOT_COST <= bank
      domBlueprintCost.style.opacity = buildable ? 1 : 0.3
      domBlueprintCost.style.textDecoration = buildable ? null : 'line-through'

      ctx.filter = buildable ? null : 'grayscale(100%)'
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

      domBlueprintImage.style.display = 'block'
    }
    ctx.restore()
  }
}
