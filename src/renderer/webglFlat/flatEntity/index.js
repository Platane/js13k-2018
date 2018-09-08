import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniformTexture,
  bindUniform,
} from '../util/shader'
import { vec3 } from 'gl-matrix'
import type { Universe, Point } from '~/type'
import type { Mat4 } from 'gl-matrix'
import { getWidth, getHeight, isNavigable, around4 } from '~/service/map'
import { normalize, length, lengthSq, cellCenter } from '~/service/point'
import { texture, boxes } from '~/renderer/texture'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

const addEntity = (size, box) => (vertices, uvs, index) => (
  position,
  u = { x: 0, y: 1 }
) => {
  const k = vertices.length / 2

  const v = { x: u.y, y: -u.x }

  // prettier-ignore
  vertices.push(
    position.x - v.x * size - u.x * size, position.y - v.y * size - u.y * size,
    position.x + v.x * size - u.x * size, position.y + v.y * size - u.y * size,
    position.x + v.x * size + u.x * size, position.y + v.y * size + u.y * size,
    position.x - v.x * size + u.x * size, position.y - v.y * size + u.y * size,
  )

  uvs.push(...(box || boxes.wall))

  // prettier-ignore
  index.push(
    k+0, k+1, k+2,
    k+0,  k+2, k+3,
  )
}

export const create = (gl: WebGLRenderingContext) => {
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

  // const texture = bindUniformTexture(gl, program, 'u')
  const attribute_position = bindAttribute(gl, program, 'aVertexPosition', 2)
  const uniform_worldMatrix = bindUniform(gl, program, 'uWorldMatrix', 'mat4')
  const attribute_uv = bindAttribute(gl, program, 'aVertexUV', 2)
  const sampler_texture = bindUniformTexture(gl, program, 'uSampler')
  const elementIndex = bindElementIndex(gl, program)

  sampler_texture.update(texture)

  return (universe: Universe, matrix: number[]) => {
    gl.useProgram(program)

    const vertices = []
    const uvs = []
    const index = []

    const w = getWidth(universe.map)
    const h = getHeight(universe.map)

    for (let x = w; x--; )
      for (let y = h; y--; ) {
        if (isNavigable(universe.map, { x, y }))
          addEntity(0.5, boxes.wall)(vertices, uvs, index)({
            x: x + 0.5,
            y: y + 0.5,
          })
      }

    const bots = universe.bots
      .slice()
      .sort((a, b) => a.position.y - b.position.y)

    const vs = bots.map(({ velocity, position }) => {
      const l = length(velocity)
      return l < 0.03
        ? { x: 0, y: 1 }
        : { x: velocity.x / l, y: velocity.y / l }
    })

    bots.forEach((bot, i) => {
      const { position } = bot

      const v = vs[i]

      addEntity(0.6, boxes.arrow)(vertices, uvs, index)(bot.position, {
        x: -v.x,
        y: -v.y,
      })
    })

    bots.forEach((bot, i) => {
      const { velocity, position } = bot

      const v = vs[i]

      let max = -1
      let k = 0
      around4.find((p, i) => {
        const m = p.x * v.x + p.y * v.y

        if (max < m) {
          max = m
          k = i
        }
      })

      const h = Math.sin(position.x * 10) + Math.sin(position.y * 10)

      addEntity(0.45, boxes['bot' + k])(vertices, uvs, index)({
        x: position.x,
        y: position.y - 0.3 + h * 0.1,
      })

      if (bot.activity && bot.activity.carrying) {
        const token = bot.activity.carrying

        const v = normalize(velocity)

        const c = {
          x: position.x - v.x * 0.3,
          y: position.y - v.y * 0.3,
        }

        addEntity(0.3, boxes[token])(vertices, uvs, index)(c)
      }
    })

    universe.droppedTokens.forEach(({ token, position }) =>
      addEntity(0.3, boxes[token])(vertices, uvs, index)(position)
    )

    attribute_uv.update(uvs)
    elementIndex.update(index)
    attribute_position.update(vertices)

    uniform_worldMatrix.update(matrix)

    elementIndex.bind()
    attribute_position.bind()
    sampler_texture.bind()
    attribute_uv.bind()
    uniform_worldMatrix.bind()

    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0)
  }
}
