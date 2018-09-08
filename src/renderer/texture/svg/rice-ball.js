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
  'M44 100c5 0 9-1 13-3h-5c-12 2-21-3-27-15-6-13-10-27-12-41-2-12 2-22 10-29C33 3 44-1 57 1 44-2 32 0 20 7 8 13 1 24 0 40s3 30 11 42c8 13 19 19 33 18zm0 0',
  'M76 35c-6-7-12-7-17 0-8 10-13 21-16 33l3 3c8 8 16 15 25 20l1-1c12-6 20-16 24-30-6-10-12-18-20-25zm0 0',
  'M61 2l-4-1C44-1 33 3 23 12c-8 7-12 17-10 29 2 14 6 28 12 41 6 12 15 17 27 15h5c5 0 9-2 13-5l1-1c-9-5-17-12-25-20l-3-3c3-12 8-23 16-33 5-7 11-7 17 0 8 7 14 15 20 25 8-14 6-27-3-40C84 8 74 2 61 2zm0 0',
]

const dbox = getNextBox(1, 1)
drawPaths(paths, [salmon_orange, salmon_pink, plank_light], box, dbox, 16)
addBox('rice-ball', dbox)
addBox('purple', dbox)
