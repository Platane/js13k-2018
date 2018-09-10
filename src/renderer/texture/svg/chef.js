import { texture, drawPaths, addBox, getNextBox } from '../tex'
import {
  dirty_shirt,
  white,
  black,
  grey_light,
  grey_true,
  plank_light,
  plank_mid,
  salmon_orange,
  salmon_pink,
  blue_light,
  blue_true,
  blue_dark,
} from '~/config/palette'

const box = [0, 0, 100, 100]
const paths = [
  // front
  [
    'M50 56h-7q0 5 3 7 3 3 7 3 3 0 4-2l1-8h-8m-26-7q-2-3-2-7l-3 12-1 14q0 11 7 18 0-8 3-16l2-8 2-8-6-3-2-2m59 19q0-14-2-23l-1-1-1-1-1 4-3 5-2 1 7 21 1 7q2-5 2-13z',
    'M28 70q-3 8-3 16l-1 5q0 3 3 5 5 3 18 3h19q7 0 11-2 3-1 5-5l1-10v-1l-1-7-7-21-15 3-1 8q-1 2-4 2-4 0-7-3-3-2-3-7l-11-2-2 8-2 8z',
    'M70 38l-13 1-22 1q-9 0-13-6l-1 5 1 3q0 4 2 7l2 2 6 3 11 2h15l15-3 2-1 3-5 1-4-4-3q-2-2-5-2z',
    'M93 28l-3-7-4-7Q82 8 70 4 59 0 46 0 30 0 24 5q-7 5-4 26v2l1 1h1q4 6 13 6l22-1 13-1q3 0 5 2l4 3 1 1 1 1 3 3 5 1 4-2q2-2 2-6l-1-6-1-7z',
  ],

  // right
  [
    'M73 58l1 2v-7q-4 4-13 5l1 1q1 2 4 2l4-2 3-1M33 37v-2l-1-1-3 1-2 3-1 6-2 9q-3 12-3 20 0 15 12 20l3-6 7-10 3-8 3-11-5-1h-1-1q-4-1-6-4h-1l-2-5V38v-1z',
    'M34 95l2 1 9 2 8 1 9-2 7-7q4-4 6-9l2-9-2-10-1-2-1-2-3 1-4 2q-3 0-4-2l-1-1H49l-3 11-3 8-7 10-3 6 1 2z',
    'M77 33q-7 4-28 4l-12-1-4-1v13l2 5h1q2 3 6 4h2l5 1h12q9-1 13-5v-1l1-1q3-4 3-11v-3-5l-1 1z',
    'M49 37q21 0 28-4l1-1 3-3v-3l-1-6-5-7q-7-9-21-9-12 0-20 5l-6 5-2 4v2l1 2 2 2 2 3v6l1 1 1 1 4 1 12 1z',
  ],

  // back
  [
    'M81 47l-1-4-2 1v3q-1 4-4 6t-11 3l-2 3q-3 2-7 2l-14-1q-3-1-6-5l-7-3-3-3-1-1h-1l-2-2-2 12-1 11q0 9 5 15l3 4q9 8 26 8 18 0 25-7l4-5q3-6 3-16 0-11-2-21z',
    'M34 55q3 4 6 5l14 1q4 0 7-2l2-3-14 1q-9 0-15-2z',
    'M78 44l-1 1q-6 5-14 5H33l-10-2 1 1 3 3 7 3q6 2 15 2l14-1q8-1 11-3t4-6v-3z',
    'M78 10q-8-6-27-6L23 5Q12 13 8 22q-3 6-3 12 0 4 2 7 2 4 7 4l2-1h3l1 2 2 2h1l10 2h30q8 0 14-5l1-1 2-1q4-6 4-15 0-12-6-18z',
  ],

  // left
  [
    'M32 57l-2-3-3-1v8l2-1 3-3m42-19v-1q-2 13-8 20l-7 7-7 1h-4l2 4q4 9 8 13l6 7 1 3v3l9-5q6-6 6-17l-2-20-4-15z',
    'M33 58l-1-1-3 3-2 1q-3 4-3 9 0 12 8 21 8 7 20 7 7 0 11-2l2-1v-3l-1-3-6-7q-4-4-8-13l-2-4q-9-1-15-7z',
    'M26 31l-2-2-1 7v8l3 6 1 3 3 1q-3-6-3-16v-4l-1-3z',
    'M69 13q-7-7-24-7-7 0-14 5-8 5-8 13l1 5 2 2 1 3v4q0 10 3 16l2 3 1 1q6 6 15 7h4l7-1 7-7q6-7 8-20V27q0-9-5-14z',
  ],
]

let dbox
;[0, 1, 2, 3].forEach(k => {
  // chief
  dbox = getNextBox(1, 1)
  drawPaths(
    paths[k],
    [
      // body
      salmon_orange,
      // shirt
      dirty_shirt,
      // face
      blue_light,
      // hat
      dirty_shirt,
    ],
    box,
    dbox,
    10
  )
  addBox('texture_bot' + k, dbox)

  // client
  dbox = getNextBox(1, 1)
  drawPaths(
    paths[k],
    [
      // body
      grey_true,
      // shirt
      grey_true,
      // face
      blue_light,
      // hat
      grey_true,
    ],
    box,
    dbox,
    10
  )
  addBox('texture_clientA' + k, dbox)

  // client
  dbox = getNextBox(1, 1)
  drawPaths(
    paths[k],
    [
      // body
      grey_light,
      // shirt
      grey_light,
      // face
      blue_light,
      // hat
      grey_light,
    ],
    box,
    dbox,
    10
  )
  addBox('texture_clientB' + k, dbox)
})
