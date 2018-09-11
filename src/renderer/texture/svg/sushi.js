import { texture, drawPaths, addBox, getNextBox } from '../tex'
import {
  black,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
} from '~/config/palette'

const box = [0, 0, 100, 100]
const paths = [
  'M16 12v-1l-2 4C9 22 6 30 2 39c-2 7-2 14 0 21 2 6 4 10 8 13 4 2 8 4 12 4l4 1 6 1c11 5 22 11 32 19 3 2 5 3 8 3 4 0 7-2 11-5l8-8c5-7 9-15 10-25v-1l-1-8-2-2-2-2-3-2-20-8-13-5-16-6-13-5-15-5v-3l-1-1h1v-3zm0 0',
  'M72 19l-14-7-15-6-12-5c-6-2-12 0-16 7A815 815 0 0 0 1 35C0 45 3 51 11 51l19 1 15 4 14 6 3 2 10 7 10 11 2-3 12-18c4-6 5-12 2-18-2-7-6-12-11-15l-15-9zm0 0',
  'M34 2l-4 6-5 8c-5 4-9 9-12 15-2 2-3 5-2 8v12l4 1-1-4c-1-9 1-16 6-20s9-10 12-16l5-7 1-1-4-2m65 42l-1-1-1-3-6 6c-4 5-8 9-13 12l-3 3-3 11 4 3v-3l1-5c2-4 5-8 8-10 3-1 6-4 8-7l6-6M89 29l-2-1-2-2-5 5-5 4-5 3-6 4-5 4-2 2-1 3v10l3 1v-1-7l1-3 4-4 6-3 6-4 5-4 5-5 3-2m-24-9l-2 1-14 10-4 4c-3 3-5 6-4 11v9l4 1-1-6 1-5c3-7 7-12 12-14 5-3 9-6 13-11l1-1-4-2-2 3M53 10l-5-2-2 2-5 5-5 5-2 3-4 7-2 3c-1 0-2 1-2 3l-1 3v10l1 3h3v-1l-1-10v-2l2-2 4-6 3-5 5-6 5-5 5-4zm0 0',
]

const dbox = getNextBox(1, 1)
drawPaths(paths, [salmon_orange, salmon_pink, plank_light], box, dbox, 16)
addBox('sushi', dbox)

