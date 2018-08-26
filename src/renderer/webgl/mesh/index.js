import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform,
} from '../util/shader'
import { length } from '~/service/point'
import { getWidth, getHeight, isNavigable } from '~/service/map'
import type { Universe } from '~/type'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

const botToMesh = (faces, colors, vertices) => bot => {
  const color = [0.4, 1, 0.2]

  const model = [
    //
    { x: 0.6, y: -0.6 },
    { x: -0.6, y: -0.6 },
    { x: 0, y: 0.8 },
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
  })
}

const wallToMesh = (faces, colors, vertices) => ({ x, y }) => {
  const color = [0.6, 0.6, 0.2]

  colors.push(...color, ...color, ...color, ...color)

  // colors.push(...color, ...color, ...color)

  const k = vertices.length / 3

  faces.push(k, k + 1, k + 2)
  faces.push(k, k + 2, k + 3)

  vertices.push(x, y, 0)
  vertices.push(x, y + 1, 0)
  vertices.push(x + 1, y + 1, 0)
  vertices.push(x + 1, y, 0)
}

const boxToMesh = (faces, colors, vertices) => c =>
  [[1, 0, 0], [0, 1, 0], [0, 0, 1], [-1, 0, 0], [0, -1, 0], [0, 0, -1]].forEach(
    ([x, y, z], i) => {
      const u = { x: y, y: z, z: x }
      const v = { x: z, y: x, z: y }

      const k = vertices.length / 3

      const color = [0.6, 0.2 + (i % 3) * 0.22, 0.1 * i]

      colors.push(...color, ...color, ...color, ...color)

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

  const uniform_worldMatrix = bindUniform(gl, program, 'uWorldMatrix', 'mat4')
  const attribute_position = bindAttribute(gl, program, 'aVertexPosition', 3)
  const attribute_color = bindAttribute(gl, program, 'aVertexColor', 3)
  const elementIndex = bindElementIndex(gl, program)

  let n_faces = 0

  const update = (universe: Universe) => {
    const faces = []
    const colors = []
    const vertices = []

    // bot meshes
    universe.bots.forEach(botToMesh(faces, colors, vertices))

    // wall meshes
    for (let x = getWidth(universe.map); x--; )
      for (let y = getHeight(universe.map); y--; )
        if (!isNavigable(universe.map, { x, y }))
          wallToMesh(faces, colors, vertices)({ x, y })

    // gizmo
    boxToMesh(faces, colors, vertices)({ x: 0, y: 0, z: 0 })
    boxToMesh(faces, colors, vertices)({ x: 27, y: 18, z: 0 })

    // gizmo
    faces.push(
      vertices.length / 3 + 0,
      vertices.length / 3 + 1,
      vertices.length / 3 + 2
    )
    const color = [0, 0, 0.2]

    colors.push(...color, ...color, ...color)

    vertices.push(0, 0, 1.1)
    vertices.push(1, 0, 0.5)
    vertices.push(0, 1, 0.5)

    attribute_position.update(vertices)
    attribute_color.update(colors)
    elementIndex.update(faces)

    n_faces = faces.length
  }

  const draw = worldMatrix => {
    gl.useProgram(program)

    uniform_worldMatrix.update(worldMatrix)

    elementIndex.bind()
    attribute_color.bind()
    attribute_position.bind()
    uniform_worldMatrix.bind()

    gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)
  }

  return { update, draw }
}
