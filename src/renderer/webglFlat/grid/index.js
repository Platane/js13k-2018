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

  const attribute_position = bindAttribute(gl, program, 'aVertexPosition', 2)
  const uniform_worldMatrix = bindUniform(gl, program, 'uWorldMatrix', 'mat4')
  const elementIndex = bindElementIndex(gl, program)

  let init = false

  let n_faces = 0

  return (universe: Universe, matrix) => {
    gl.useProgram(program)

    const w = getWidth(universe.map)
    const h = getHeight(universe.map)

    const l = 10

    const index = []
    const vertices = []
    for (let x = -l; x <= w + l; x++) {
      index.push(index.length - 1, index.length)

      if (x % 2) vertices.push(x, -l, x, l + h)
      else vertices.push(x, l + h, x, -l)
    }

    for (let y = -l; y <= h + l; y++) {
      index.push(index.length - 1, index.length)

      if (y % 2) vertices.push(-l, y, l + w, y)
      else vertices.push(l + w, y, -l, y)
    }

    // prettier-ignore
    attribute_position.update(vertices)
    uniform_worldMatrix.update(matrix)
    elementIndex.update(index)

    elementIndex.bind()
    attribute_position.bind()
    uniform_worldMatrix.bind()

    gl.drawElements(gl.LINE_STRIP, vertices.length / 2, gl.UNSIGNED_SHORT, 0)
  }
}
