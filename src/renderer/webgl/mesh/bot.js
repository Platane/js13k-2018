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

export const getConeFaces = (radius: number, height: number, s: number) =>
  Array.from({ length: s }).map((_, i, arr) => {
    const a = (i / arr.length) * Math.PI * 2
    const b = ((i + 1) / arr.length) * Math.PI * 2

    return [
      { x: Math.cos(a) * radius, y: Math.sin(a) * radius, z: 0 },
      { x: Math.cos(b) * radius, y: Math.sin(b) * radius, z: 0 },
      { x: 0, y: 0, z: height },
    ]
  })

export const facesToMesh = (faces, colors, vertices, normals) => (color, f) =>
  f.forEach(([A, B, C]) => {
    const k = vertices.length / 3

    faces.push(k, k + 1, k + 2)

    colors.push(...color, ...color, ...color)

    vertices.push(A.x, A.y, A.z)
    vertices.push(B.x, B.y, B.z)
    vertices.push(C.x, C.y, C.z)

    const AB = vec3.create()
    const AC = vec3.create()
    const N = vec3.create()
    vec3.set(AB, B.x - A.x, B.y - A.y, B.z - A.z)
    vec3.set(AC, C.x - A.x, C.y - A.y, C.z - A.z)
    vec3.cross(N, AB, AC)
    vec3.normalize(N, N)

    // N[0] = 0
    // N[1] = 1
    // N[2] = 0

    normals.push(...N)
    normals.push(...N)
    normals.push(...N)
  })

export const botToMesh = (faces, colors, vertices, normals) => bot => {
  // cone
  const color = [0.4, 1, 0.2]

  const f = getConeFaces(0.25, 0.5, 8).map(f =>
    f.map(p => ({ x: p.x + bot.position.x, y: p.y + bot.position.y, z: p.z }))
  )

  facesToMesh(faces, colors, vertices, normals)([0.4, 0.5, 1], f)

  // arrow
  const model = [
    //
    { x: 0.2, y: -0.2 },
    { x: -0.2, y: -0.2 },
    { x: 0, y: 0.5 },
  ]

  model.forEach(({ x, y }) => {
    faces.push(vertices.length / 3)

    colors.push(...color)

    const l = length(bot.velocity)

    const v = { x: 1, y: 0 }

    if (l > 0.01) {
      v.x = bot.velocity.x / l
      v.y = bot.velocity.y / l
    }

    vertices.push(
      bot.position.x + y * v.x + v.y * x,
      bot.position.y + y * v.y - v.x * x,
      0
    )

    normals.push(0, 0, 1)
  })
}
