import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform,
} from '../util/shader'
import { length } from '~/service/point'
import { getWidth, getHeight, isNavigable } from '~/service/map'
import { vec3 } from 'gl-matrix'
import { getConeFaces, facesToMesh } from './bot'
import type { Universe, Point } from '~/type'
import type { Mat4 } from 'gl-matrix'

const getSeaFaces = (t: number) => {
  const r = 3
  const l = 40

  const faces = []

  const h = (x, y) =>
    -1 +
    (Math.sin(x * 0.6 + t * 0.02 + 123) +
      Math.sin(x * 0.6 + t * 0.0145 + 1366) +
      Math.sin(x * 0.6 + t * 0.047 + 84239) +
      Math.sin(y * 0.59 + t * 0.04123 + 754) +
      Math.sin(y * 0.59 + t * 0.0231 + 1754) +
      0) *
      0.2

  for (let x = -l; x <= l; x += r)
    for (let y = -l; y <= l; y += r) {
      faces.push(
        [
          { x: x, y: y, z: h(x, y) },
          { x: x + r, y: y, z: h(x + r, y) },
          { x: x + r, y: y + r, z: h(x + r, y + r) },
        ],
        [
          { x: x, y: y, z: h(x, y) },
          { x: x + r, y: y + r, z: h(x + r, y + r) },
          { x: x, y: y + r, z: h(x, y + r) },
        ]
      )
    }

  return faces
}

export const seaToMesh = (faces, colors, vertices, normals) => t => {
  // cone
  const color = [0.5, 0.4, 0.8]

  facesToMesh(faces, colors, vertices, normals)(color, getSeaFaces(t))
}
