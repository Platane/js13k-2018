import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform,
} from '../util/shader'
import { vec3 } from 'gl-matrix'
import type { Universe, Point } from '~/type'
import type { Mat4 } from 'gl-matrix'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

export const create = (gl: WebGLRenderingContext) => {
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

  const attribute_position = bindAttribute(gl, program, 'aVertexPosition', 2)
  const elementIndex = bindElementIndex(gl, program)

  // prettier-ignore
  attribute_position.update([
     -1, -1,
      1, -1,
      1,  1,
     -1,  1,
  ])

  // prettier-ignore
  elementIndex.update([
    0, 1, 2,
    0, 2, 3,
  ])

  let n_faces = 6

  const update = (universe: Universe) => null

  const draw = (worldMatrix: Mat4) => {
    gl.useProgram(program)

    elementIndex.bind()
    attribute_position.bind()

    gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)
  }

  return { update, draw }
}
