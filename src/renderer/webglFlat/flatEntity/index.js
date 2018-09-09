import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniformTexture,
  bindUniform,
} from '../util/shader'
import { getWidth, getHeight, isNavigable, around4 } from '~/service/map'
import { texture, boxes } from '~/renderer/texture'
import { renderMachines } from './entities/machines'
import { renderOverlay } from './entities/overlay'
import { renderFloor } from './entities/floor'
import { renderBots } from './entities/bots'
import { addEntity } from './entities/util'
import type { Universe, Point, UIstate } from '~/type'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

export const create = (gl: WebGLRenderingContext) => {
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

  // const texture = bindUniformTexture(gl, program, 'u')
  const attribute_position = bindAttribute(gl, program, 'aVertexPosition', 2)
  const uniform_worldMatrix = bindUniform(gl, program, 'uWorldMatrix', 'mat4')
  const attribute_opacity = bindAttribute(gl, program, 'aOpacity', 1)
  const attribute_uv = bindAttribute(gl, program, 'aVertexUV', 2)
  const sampler_texture = bindUniformTexture(gl, program, 'uSampler')
  const elementIndex = bindElementIndex(gl, program)

  sampler_texture.update(texture)

  return (universe: Universe, uistate: UIstate, matrix: number[]) => {
    if (gl.lastprogram !== program) gl.useProgram(program)

    const vertices = []
    const opacity = []
    const uvs = []
    const index = []

    // render navigable tiles
    renderFloor(universe, uistate)(vertices, uvs, opacity, index)

    // render bots
    renderMachines(universe, uistate)(vertices, uvs, opacity, index)

    // render bots
    renderBots(universe, uistate)(vertices, uvs, opacity, index)

    //render dropped tokens
    universe.droppedTokens.forEach(({ token, position }) =>
      addEntity(0.3, 0.3, boxes[token])(vertices, uvs, opacity, index)(position)
    )

    renderOverlay(universe, uistate)(vertices, uvs, opacity, index)

    attribute_uv.update(uvs)
    elementIndex.update(index)
    attribute_opacity.update(opacity)
    attribute_position.update(vertices)

    uniform_worldMatrix.update(matrix)

    elementIndex.bind()
    attribute_position.bind()
    attribute_uv.bind()
    uniform_worldMatrix.bind()
    if (gl.lastprogram !== program) sampler_texture.bind()

    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0)

    gl.lastprogram = program
  }
}
