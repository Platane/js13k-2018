import { texture, addBox, drawPaths, getNextBox } from '../tex'
import {
  black,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
} from '~/config/palette'

const box = [0, 0, 100, 100]
const paths = [
  'M96 27l2-7v-4l-7-1-15 6-9 4-6 4-22 18-10 10C17 68 10 77 7 82c-2 3-2 6-2 8s1 4 3 5c1 2 3 3 5 3l9-2 11-7 16-12v1l27-24 8-8c6-5 10-12 12-19zm0 0',
]

let dbox = getNextBox(1, 1)
drawPaths(
  paths,
  [plank_light],
  box,
  [dbox[0], dbox[1] + dbox[2] * 0, dbox[2], dbox[3] * 0.7],
  16
)
drawPaths(
  paths,
  [plank_mid],
  box,
  [dbox[0], dbox[1] + dbox[2] * 0.2, dbox[2], dbox[3] * 0.7],
  16
)
addBox('rice-grain', dbox)

dbox = getNextBox(1, 1)
drawPaths(
  paths,
  [plank_light],
  box,
  [dbox[0], dbox[1] + dbox[2] * 0, dbox[2], dbox[3] * 0.7],
  16,
  true
)
drawPaths(
  paths,
  [plank_mid],
  box,
  [dbox[0], dbox[1] + dbox[2] * 0.2, dbox[2], dbox[3] * 0.7],
  16,
  true
)
addBox('rice-grain' + 10, dbox)
