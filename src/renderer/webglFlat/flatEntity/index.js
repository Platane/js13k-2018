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
import { getWidth, getHeight } from '~/service/map'
import { texture } from '~/renderer/texture'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

export const create = (gl: WebGLRenderingContext) => {
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

  // const texture = bindUniformTexture(gl, program, 'u')
  const attribute_position = bindAttribute(gl, program, 'aVertexPosition', 2)
  const uniform_worldMatrix = bindUniform(gl, program, 'uWorldMatrix', 'mat4')
  const attribute_uv = bindAttribute(gl, program, 'aVertexUV', 2)
  const sampler_texture = bindUniformTexture(gl, program, 'uSampler')
  const elementIndex = bindElementIndex(gl, program)

  // prettier-ignore
  attribute_position.update([
     -0.3, -0.3,
      0.3, -0.3,
      0.3,  0.3,
     -0.3,  0.3,
  ])
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

    const w = getWidth(universe.map)
    const h = getHeight(universe.map)

    // prettier-ignore
    attribute_position.update([
      0, 0,
      0, h,
      w, h,
      w, 0,
    ])
    uniform_worldMatrix.update(matrix)

    elementIndex.bind()
    attribute_position.bind()
    sampler_texture.bind()
    attribute_uv.bind()
    uniform_worldMatrix.bind()

    gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)
  }
}
