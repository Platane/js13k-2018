import { getWidth, getHeight, isNavigable } from '~/service/map'
import { box as floorBox, fw, fh } from '~/renderer/texture/floor'
import { boxes } from '~/renderer/texture'
import { boxToBox } from '~/renderer/texture/tex'
import { addEntity } from './util'
import type { Universe, UIstate } from '~/type'

const tilex = 10
const tiley = 4

export const renderFloor = (universe: Universe, uistate: UIstate) => (
  vertices: number[],
  uvs: number[],
  index: number[]
) => {
  const w = getWidth(universe.map)
  const h = getHeight(universe.map)

  for (let x = w; x--; )
    for (let y = h; y--; )
      if (isNavigable(universe.map, { x, y })) {
        let tx1 = (x + 3 * y + y * y) % tilex
        let tx2 = (x + 1) % tilex

        if (tx2 === 0) {
          tx2 = tilex
        }

        let ty1 = (y + 0 * y) % tiley
        let ty2 = (y + 1) % tiley

        if (ty2 === 0) {
          ty2 = tiley
        }

        const box = [
          floorBox[0] + (tx1 * floorBox[2]) / tilex,
          floorBox[1] + (ty1 * floorBox[3]) / tiley,
          floorBox[2] / tilex,
          floorBox[3] / tiley,
        ]

        addEntity(0.5, 0.5, boxToBox(box))(vertices, uvs, index)({
          x: x + 0.5,
          y: y + 0.5,
        })
      }
}
