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

const buildLookAtMatrix = (tx, ty) => {
  const z = vec3.create()
  vec3.set(z, 0, 0, 1)
  const y = vec3.create()
  vec3.set(y, 0, 1, 0)

  const v = vec3.create()
  vec3.set(v, tx, ty, 1)
  vec3.normalize(v, v)

  const u = vec3.create()
  vec3.cross(u, v, y)

  const lookAtMatrix = mat4.create()

  // prettier-ignore
  mat4.set(
    lookAtMatrix,
   -u[0]    ,-u[1]    ,-u[2]    , 0,
   -y[0]    ,-y[1]    ,-y[2]    , 0,
   -v[0]    ,-v[1]    ,-v[2]    , 0,
    0       , 0       , 0       , 1,
  )

  mat4.invert(lookAtMatrix, lookAtMatrix)

  return lookAtMatrix
}

let mousex = 0
let mousey = 0

document.body.addEventListener('mousemove', event => {
  const { width, height } = event.currentTarget.getBoundingClientRect()

  mousex = event.clientX / width - 0.5
  mousey = event.clientY / height - 0.5
})

export const createWebGL = (canvas: HTMLCanvasElement) => {
  const gl = initGL(canvas)

  const meshDrawCall = createMesh(gl)

  const update = (universe: Universe, camera: Camera) => {
    const a = 1 / camera.a

    // prettier-ignore
    const scale = [
      a, 0, 0, 0,
      0, a, 0, 0,
      0, 0, a, 0,
      0, 0, 0, 1,
    ]

    const near = 0.01
    const far = 1

    let fovx = Math.PI / 2.2
    let aspect = canvas.clientWidth / canvas.clientHeight

    // const worldMatrix       = mat4.create()
    const frustrumMatrix = mat4.create()
    const lookAtMatrix = buildLookAtMatrix(mousex * 3, mousey * 3)

    mat4.perspective(frustrumMatrix, fovx, aspect, near, far)
    // mat4.identity(frustrumMatrix)

    const m = mat4.create()
    mat4.identity(m)

    // mat4.multiply(m, m, frustrumMatrix)
    mat4.multiply(m, m, lookAtMatrix)
    mat4.multiply(m, m, scale)

    meshDrawCall.update(universe)

    // render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    meshDrawCall.draw(m)
  }

  return { update }
}
