import { mat4, vec3 } from 'gl-matrix'
import { create as createFlatEntity } from './flatEntity'
import { create as createGrid } from './grid'
import { getWidth, getHeight } from '~/service/map'
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

  gl.cullFace(gl.FRONT)

  gl.enable(gl.BLEND)
  gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  return gl
}

const computeWorldMatrix = map => {
  // map
  const mw = getWidth(map)
  const mh = getHeight(map)

  // screen
  const sw = window.innerWidth
  const sh = window.innerHeight

  const r = Math.min(sw / mw, sh / mh)

  // screen in map coord
  const uw = sw / r
  const uh = sh / r

  const a = 0.96

  const mx = -1 + (1 * (uw - mw)) / uw
  const my = -1 + (1 * (uh - mh)) / uh

  // prettier-ignore
  const m = [
    a *2 / uw ,0,0,0,
    0,a *2 / uh ,0,0,
    0,0,1,0,
    a *mx,a *my,0,1,
  ]

  return m
}

export const createWebGL = (canvas: HTMLCanvasElement) => {
  const gl = initGL(canvas)

  const flatEntityDrawCall = createFlatEntity(gl)
  const gridDrawCall = createGrid(gl)

  let worldMatrix

  window.onresize = () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    worldMatrix = null
  }

  return (universe: Universe) => {
    worldMatrix = worldMatrix || computeWorldMatrix(universe.map)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    flatEntityDrawCall(universe, worldMatrix)
    gridDrawCall(universe, worldMatrix)
  }
}
