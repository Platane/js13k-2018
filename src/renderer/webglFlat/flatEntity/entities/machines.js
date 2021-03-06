import {
  getWidth,
  getHeight,
  isNavigable,
  isInside,
  around4,
  getCell,
} from '~/service/map'
import { proj } from '~/service/machine'
import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { boxes } from '~/renderer/texture'
import { addEntity } from './util'
import {
  texture_arrow_output_box,
  texture_circle_box,
} from '~/renderer/texture/svg/arrow'
import { MACHINE_ACTIVATION_COOLDOWN } from '~/config'

import type { Universe, Point, Machine, UIstate } from '~/type'

export const renderMachine = (m: Machine, alpha: number = 1) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => {
  const { id, inputs, outputs, ground } = m.blueprint

  const v = around4[(m.rotation + 4) % 4]

  const w = getWidth(ground)
  const h = getHeight(ground)

  const p = proj(m)

  const A = p({ x: 0, y: 0 })
  const B = p({ x: w, y: h })

  const min = { x: Math.min(A.x, B.x), y: Math.min(A.y, B.y) }
  const max = { x: Math.max(A.x, B.x), y: Math.max(A.y, B.y) }

  // magic, don't ask it's working
  const position = {
    x: (min.x + max.x) / 2 + (v.x + v.y == -1),
    y: (min.y + max.y) / 2 + (v.x - v.y == 1),
  }

  addEntity(h / 2, w / 2, boxes[id], alpha)(vertices, uvs, opacity, index)(
    position,
    v
  )

  for (let x = w; x--; )
    for (let y = h; y--; )
      if (getCell(ground, { x, y }) == 3) {
        const a = m.processing
          ? Math.max(0, m.processing.activationCoolDown) /
            MACHINE_ACTIVATION_COOLDOWN
          : 0
        const k =
          (m.processing ? m.processing.k : 0) / m.blueprint.activationThreshold

        const u = 1 + a * 0.5

        const tl = 0.2 * (1 + a * 0.8)
        const tc = 0.55 * (1 + a * 0.2)

        addEntity(tc, tc, texture_circle_box, 0.4 * alpha)(
          vertices,
          uvs,
          opacity,
          index
        )(cellCenter(proj(m)({ x, y })))

        addEntity(tl, tl, boxes[outputs[0].token + 10], alpha)(
          vertices,
          uvs,
          opacity,
          index
        )(cellCenter(proj(m)({ x, y })))

        addEntity(tl, tl, boxes[outputs[0].token], k * alpha)(
          vertices,
          uvs,
          opacity,
          index
        )(cellCenter(proj(m)({ x, y })))
      }

  //

  // const s = 0.26
  //
  // inputs.forEach(({ cell }) => {
  //   const a = p(cell)
  //
  //   const position = { x: a.x + 0.5, y: a.y + 0.5 }
  //
  //   const u = around4.find(v => {
  //     const o = { x: v.x + cell.x, y: v.y + cell.y }
  //
  //     return isInside(ground, o) && !isNavigable(ground, o)
  //   }) || { x: 0, y: 1 }
  //
  //   const d = {
  //     //
  //     x: v.x * -u.x + v.y * -u.y,
  //     y: v.y * -u.x - v.x * -u.y,
  //   }
  //
  //   addEntity(s, s, boxes.texture_arrow_input, alpha)(vertices, uvs, opacity, index)(
  //     position,
  //     d
  //   )
  // })
  //
  // outputs.forEach(({ cell }) => {
  //   const a = p(cell)
  //
  //   const position = { x: a.x + 0.5, y: a.y + 0.5 }
  //
  //   const u = around4.find(v => {
  //     const o = { x: v.x + cell.x, y: v.y + cell.y }
  //
  //     return isInside(ground, o) && !isNavigable(ground, o)
  //   }) || { x: 0, y: 1 }
  //
  //   const d = {
  //     //
  //     x: v.x * u.x + v.y * u.y,
  //     y: v.y * u.x - v.x * u.y,
  //   }
  //
  //   addEntity(s, s, boxes.texture_arrow_ouput, alpha)(vertices, uvs, opacity, index)(
  //     position,
  //     d
  //   )
  // })
}

export const renderMachines = (universe: Universe, uistate: UIstate) => (
  vertices: number[],
  uvs: number[],
  opacity: number[],
  index: number[]
) => {
  universe.machines.forEach(m =>
    renderMachine(m)(vertices, uvs, opacity, index)
  )

  // customer zone
  const s = 0.3
  universe.customers.forEach(({ cell }) =>
    addEntity(s, s, texture_arrow_output_box)(vertices, uvs, opacity, index)(
      cellCenter(cell),
      { x: -1, y: 0 }
    )
  )
}
