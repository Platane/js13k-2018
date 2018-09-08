import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniformTexture,
  bindUniform,
} from '../util/shader'
import { getWidth, getHeight, isNavigable, around4 } from '~/service/map'
import { texture, boxes } from '~/renderer/texture'
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
  const attribute_uv = bindAttribute(gl, program, 'aVertexUV', 2)
  const sampler_texture = bindUniformTexture(gl, program, 'uSampler')
  const elementIndex = bindElementIndex(gl, program)

  sampler_texture.update(texture)

  return (universe: Universe, uistate: UIstate, matrix: number[]) => {
    gl.useProgram(program)

    const vertices = []
    const uvs = []
    const index = []

    // render navigable tiles
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

    // render bots
    renderBots(universe, uistate)(vertices, uvs, index)

    //render dropped tokens
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
