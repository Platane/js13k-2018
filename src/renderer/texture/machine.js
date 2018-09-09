import { plank_light, plank_mid } from '~/config/palette'
import {
  around8,
  isInside,
  getWidth,
  getHeight,
  isNavigable,
  isContructible,
} from '~/service/map'
import { l, offset, ctx, getNextBox, addBox } from './tex'
import { blueprints } from '~/config/blueprints'
import { proj } from '~/service/machine'

ctx.save()

blueprints.forEach(blueprint => {
  const w = getWidth(blueprint.ground)
  const h = getHeight(blueprint.ground)

  const box = getNextBox(h, w)

  addBox('machine' + blueprint.id, box)

  //

  ctx.save()
  ctx.translate(box[0] * l, box[1] * l)
  ctx.scale(l / 100 / offset.s, l / 100 / offset.s)

  for (let x = w; x--; )
    for (let y = h; y--; ) {
      ctx.fillStyle = '#0000'

      if (!isNavigable(blueprint.ground, { x, y })) ctx.fillStyle = '#134'

      const m = 10

      ctx.fillRect(
        //
        y * 100 + m,
        x * 100 + m,
        100 - m * 2,
        100 - m * 2
      )

      for (let k = 8; k--; ) {
        const v = around8[k]

        const c = { x: v.x + x, y: v.y + y }

        if (
          !isNavigable(blueprint.ground, c) &&
          isInside(blueprint.ground, c)
        ) {
          if (v.x * v.y === 0)
            ctx.fillRect(
              //
              y * 100 + m + v.y * 50,
              x * 100 + m + v.x * 50,
              100 - m * 2,
              100 - m * 2
            )
          else if (
            !isNavigable(blueprint.ground, { x, y: y + v.y }) &&
            !isNavigable(blueprint.ground, { x: x + v.x, y }) &&
            !false
          ) {
            ctx.fillRect(
              y * 100 + m + v.y * 50,
              x * 100 + m + v.x * 50,
              100 - m * 2,
              100 - m * 2
            )
          }
        }
      }
    }

  //
  ctx.restore()
})

ctx.restore()
