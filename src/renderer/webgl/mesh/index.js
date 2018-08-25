import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform,
} from '../util/shader'
import { length } from '~/service/point'
import type { Universe } from '~/type'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

const botToMesh = (faces, colors, vertices) => bot => {
  const color = [0.4, 1, 0.2]

  // const model = [
  //   //
  //   { x: 0.1, y: -0.1 },
  //   { x: -0.1, y: -0.1 },
  //   { x: 0, y: 0.1 },
  // ]
  const model = [
    //
    { x: 0.6, y: -0.6 },
    { x: -0.6, y: -0.6 },
    { x: 0, y: 0.8 },
  ]

  model.forEach(({ x, y }) => {
    faces.push(vertices.length / 3)

    colors.push(...color)

    // vertices.push(x, y, 0)
    //

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

    universe.bots.forEach(botToMesh(faces, colors, vertices))

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
