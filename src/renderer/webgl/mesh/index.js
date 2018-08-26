import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform,
} from '../util/shader'
import { length } from '~/service/point'
import { getWidth, getHeight, isNavigable } from '~/service/map'
import { vec3 } from 'gl-matrix'
import type { Universe } from '~/type'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

const getConeFaces = (r, h, s) =>
  Array.from({ length: s }).map((_, i, arr) => {
    const a = (i / arr.length) * Math.PI * 2
    const b = ((i + 1) / arr.length) * Math.PI * 2

    return [
      { x: Math.cos(a) * r, y: Math.sin(a) * r, z: 0 },
      { x: Math.cos(b) * r, y: Math.sin(b) * r, z: 0 },
      { x: 0, y: 0, z: h },
    ]
  })

const facesToMesh = (faces, colors, vertices, normals) => (color, f) =>
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

const botToMesh = (faces, colors, vertices, normals) => bot => {
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

const wallToMesh = (faces, colors, vertices, normals) => ({ x, y }) => {
  const color = [0.6, 0.6, 0.2]

  for (let i = 4; i--; ) colors.push(...color)

  for (let i = 4; i--; ) normals.push(0, 0, 1)

  const k = vertices.length / 3

  faces.push(k, k + 1, k + 2)
  faces.push(k, k + 2, k + 3)

  vertices.push(x, y, 0)
  vertices.push(x, y + 1, 0)
  vertices.push(x + 1, y + 1, 0)
  vertices.push(x + 1, y, 0)
}

const boxToMesh = (faces, colors, vertices, normals) => c =>
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

export const create = (gl: WebGLRenderingContext) => {
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

  const uniform_lightsource = bindUniform(gl, program, 'uLightSource', 'vec3')
  const uniform_worldMatrix = bindUniform(gl, program, 'uWorldMatrix', 'mat4')
  const attribute_position = bindAttribute(gl, program, 'aVertexPosition', 3)
  const attribute_normal = bindAttribute(gl, program, 'aVertexNormal', 3)
  const attribute_color = bindAttribute(gl, program, 'aVertexColor', 3)
  const elementIndex = bindElementIndex(gl, program)

  let n_faces = 0

  const update = (universe: Universe) => {
    t++
    lightPosition.x = 3 * Math.cos(t * 0.01)
    lightPosition.y = 3 * Math.sin(t * 0.01)

    uniform_lightsource.update([
      lightPosition.x,
      lightPosition.y,
      lightPosition.z,
    ])

    const faces = []
    const colors = []
    const normals = []
    const vertices = []

    // bot meshes
    universe.bots.forEach(botToMesh(faces, colors, vertices, normals))

    // wall meshes
    for (let x = getWidth(universe.map); x--; )
      for (let y = getHeight(universe.map); y--; )
        if (!isNavigable(universe.map, { x, y }))
          wallToMesh(faces, colors, vertices, normals)({ x, y })

    // gizmo
    boxToMesh(faces, colors, vertices, normals)({ x: 0, y: 0, z: 0 })
    boxToMesh(faces, colors, vertices, normals)({ x: 27, y: 18, z: 0 })
    boxToMesh(faces, colors, vertices, normals)(lightPosition)

    facesToMesh(faces, colors, vertices, normals)(
      [0, 1, 0.3],
      getConeFaces(2, 5, 8)
    )

    attribute_position.update(vertices)
    attribute_normal.update(normals)
    attribute_color.update(colors)
    elementIndex.update(faces)

    n_faces = faces.length
  }

  let t = 0
  let lightPosition = { x: 0, y: 0, z: 2 }

  const draw = worldMatrix => {
    gl.useProgram(program)

    uniform_worldMatrix.update(worldMatrix)

    elementIndex.bind()
    attribute_color.bind()
    attribute_normal.bind()
    attribute_position.bind()
    uniform_worldMatrix.bind()
    uniform_lightsource.bind()

    gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)
  }

  return { update, draw }
}
