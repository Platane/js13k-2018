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
import { getWidth, getHeight, isNavigable } from '~/service/map'
import { normalize, lengthSq, cellCenter } from '~/service/point'
import { texture, boxes } from '~/renderer/texture'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

const addEntity = (size, box) => (vertices, uvs, index) => (
  position,
  direction
) => {
  const k = vertices.length / 2

  // prettier-ignore
  vertices.push(
    position.x - size, position.y - size,
    position.x + size, position.y - size,
    position.x + size, position.y + size,
    position.x - size, position.y + size,
  )

  uvs.push(...box)

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

  // prettier-ignore
  attribute_uv.update([
     0, 0,
     1, 0,
     1, 1,
     0, 1,
  ])

  // prettier-ignore
  elementIndex.update([
    0, 1, 2,
    0, 2, 3,
  ])

  sampler_texture.update(texture)

  let n_faces = 6

  return (universe: Universe, matrix) => {
    gl.useProgram(program)

    const vertices = []
    const uvs = []
    const index = []

    const w = getWidth(universe.map)
    const h = getHeight(universe.map)

    for (let x = w; x--; )
      for (let y = h; y--; ) {
        if (isNavigable(universe.map, { x, y }))
          addEntity(0.5, boxes['wall'])(vertices, uvs, index)({
            x: x + 0.5,
            y: y + 0.5,
          })
      }

    universe.bots.forEach(bot => {
      addEntity(0.3, boxes['bot'])(vertices, uvs, index)(bot.position)

      if (bot.activity && bot.activity.carrying) {
        const token = bot.activity.carrying

        const v = normalize(bot.velocity)

        const c = {
          x: bot.position.x - v.x * 0.3,
          y: bot.position.y - v.y * 0.3,
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
