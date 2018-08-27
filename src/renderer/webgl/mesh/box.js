import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform,
} from '../util/shader'
import { length } from '~/service/point'
import { getWidth, getHeight, isNavigable } from '~/service/map'
import { vec3 } from 'gl-matrix'
import type { Universe, Point } from '~/type'
import type { Mat4 } from 'gl-matrix'

export const boxToMesh = (faces, colors, vertices, normals) => c =>
  [[1, 0, 0], [0, 1, 0], [0, 0, 1], [-1, 0, 0], [0, -1, 0], [0, 0, -1]].forEach(
    ([x, y, z], i) => {
      const u = { x: y, y: z, z: x }
      const v = { x: z, y: x, z: y }

      const k = vertices.length / 3

      const color = [0.6, 0.2 + (i % 3) * 0.22, 0.1 * i]

      for (let i = 4; i--; ) colors.push(...color)

      for (let i = 4; i--; ) normals.push(x, y, z)

      vertices.push(x - u.x + v.x, y - u.y + v.y, z - u.z + v.z)
      vertices.push(x - u.x - v.x, y - u.y - v.y, z - u.z - v.z)
      vertices.push(x + u.x + v.x, y + u.y + v.y, z + u.z + v.z)
      vertices.push(x + u.x - v.x, y + u.y - v.y, z + u.z - v.z)

      for (let i = 4; i--; ) {
        vertices[k * 3 + i * 3 + 0] =
          vertices[k * 3 + i * 3 + 0] * 0.5 + 0.5 + c.x
        vertices[k * 3 + i * 3 + 1] =
          vertices[k * 3 + i * 3 + 1] * 0.5 + 0.5 + c.y
        vertices[k * 3 + i * 3 + 2] =
          vertices[k * 3 + i * 3 + 2] * 0.5 + 0.5 + c.z
      }

      faces.push(k + 0, k + 1, k + 3)
      faces.push(k + 0, k + 3, k + 2)
    }
  )
