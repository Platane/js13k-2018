import { plank_light, plank_mid } from '~/config/palette'
import {
  around4,
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

const isBlock = (map, c) => isInside(map, c) && isNavigable(map, c)

const findCorner = ground => {
  const w = getWidth(ground)
  const h = getHeight(ground)

  for (let x = w; x--; )
    for (let y = h; y--; )
      if (isBlock(ground, { x, y }))
        for (let k = around8.length; k--; )
          if (
            around8[k].x * around8[k].y &&
            !isBlock(ground, { x: x + around8[k].x, y: y + around8[k].y }) &&
            !isBlock(ground, { x: x + around8[k].x, y }) &&
            !isBlock(ground, { y: y + around8[k].y, x })
          )
            return { cell: { x, y }, corner: around8[k] }
}
