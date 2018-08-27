import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform,
} from '../util/shader'
import { length } from '~/service/point'
import { getWidth, getHeight, isNavigable } from '~/service/map'
import { vec3 } from 'gl-matrix'
import { botToMesh, getConeFaces, facesToMesh } from './bot'
import { boxToMesh } from './box'
import { seaToMesh } from './sea'
import type { Universe, Point } from '~/type'
import type { Mat4 } from 'gl-matrix'

//$FlowFixMe
import fragmentShaderSource from './fragment_fs.glsl'
//$FlowFixMe
import vertexShaderSource from './vertex_vs.glsl'

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

    // sea
    // seaToMesh(faces, colors, vertices, normals)(t)

    attribute_position.update(vertices)
    attribute_normal.update(normals)
    attribute_color.update(colors)
    elementIndex.update(faces)

    n_faces = faces.length
  }

  let t = 0
  let lightPosition = { x: 0, y: 0, z: 3 }

  const draw = (worldMatrix: Mat4) => {
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
