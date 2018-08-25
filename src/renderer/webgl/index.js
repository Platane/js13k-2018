import { mat4, vec3 } from 'gl-matrix'
import { create as createMesh } from './mesh'
import type { Universe, Camera } from '~/type'

const WEBGL_OPTIONS = {
  alpha: true,
  antialias: true,
  depth: true,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  stencil: true,
}

const initGL = (canvas: HTMLCanvasElement) => {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  const gl: ?WebGLRenderingContext =
    canvas.getContext('webgl2', WEBGL_OPTIONS) ||
    canvas.getContext('webgl-experimental2', WEBGL_OPTIONS) ||
    canvas.getContext('webgl', WEBGL_OPTIONS) ||
    canvas.getContext('webgl-experimental', WEBGL_OPTIONS)

  if (!gl) throw 'WebGl not supported'

  gl.clearColor(0.5, 0.5, 0.5, 0.5)
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  gl.cullFace(gl.FRONT_AND_BACK)

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LESS)

  gl.enable(gl.BLEND)
  gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  return gl
}

export const createWebGL = (canvas: HTMLCanvasElement) => {
  const gl = initGL(canvas)

  const meshDrawCall = createMesh(gl)

  const update = (universe: Universe, camera: Camera) => {
    const a = 1 / camera.a

    // prettier-ignore
    const worldMatrix = [
      a, 0, 0, 0,
      0, a, 0, 0,
      0, 0, a, 0,
      0, 0, 0, 1,
    ]

    meshDrawCall.update(universe)

    // render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    meshDrawCall.draw(worldMatrix)
  }

  return { update }
}
