import { texture, drawPaths, addBox } from '../tex'
import {
  black,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
} from '~/config/palette'

const box = [0, 0, 100, 100]
const paths = [
  'M21 2h-3L2 13c-3 5-3 10-3 16l2 18 5 11 10 7 12 7 22 11c5 0 9 0 14-3 3-2 6-2 9 2l5 7c2 6 6 9 11 10h1l3-12c0-7 0-13 3-19l4-17c1-4 0-6-2-7-5-3-10-2-14 1s-6 2-8-3l-9-14-8-10c-3-3-6-6-10-7-9-4-18-7-28-9zm0 0',
  'M24 14c0-2-2-4-3-4-5-2-8-1-10 4l-1 5 2 5 2 1c5 2 8 1 10-5v-6m-5 8l-1 1 2-3-1 2m58 39v-1l-1-1-5-3-5-2-33-17h-1l-2 2 2 2 43 22h2v-2M29 16l-2 1v4l-1 7-1 6-2 7-3 6-1 1-3 2v3l1 1 2-1 1-1 1-1 2-3 3-7 2-7 2-7V17l-1-1m4 63c2-2 2-4 1-7l-1-1c-5-5-11-8-17-8l2 8c1 2 2 5 4 6 2 3 5 4 8 4 2 0 3 0 3-2m5-68l12 6c6 3 12 7 17 13h1c3-4 3-8 0-12l-5-5C55 6 46 1 36 0c-4 0-9 1-13 4v1zm0 0',
]

const dbox = [2 / 4, 0, 1 / 4, 1 / 4]
drawPaths(paths, [salmon_orange, salmon_pink, plank_light], box, dbox, 16)
addBox('raw-tuna', dbox)
addBox('tune-bit', dbox)
addBox('yellow', dbox)
