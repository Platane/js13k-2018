import { create as createFlatEntity } from './flatEntity'
import { getWidth, getHeight } from '~/service/map'
import type { Universe, Point, UIstate } from '~/type'

const WEBGL_OPTIONS = {
  alpha: true,
  antialias: true,
  depth: true,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  stencil: true,
}

const pixelRatio = window.devicePixelRatio || 1

const initGL = (canvas: HTMLCanvasElement) => {
  canvas.width = canvas.clientWidth * pixelRatio
  canvas.height = canvas.clientHeight * pixelRatio

  const gl: ?WebGLRenderingContext =
    canvas.getContext('webgl2', WEBGL_OPTIONS) ||
    canvas.getContext('webgl-experimental2', WEBGL_OPTIONS) ||
    canvas.getContext('webgl', WEBGL_OPTIONS) ||
    canvas.getContext('webgl-experimental', WEBGL_OPTIONS)

  if (!gl) throw 'WebGl not supported'

  gl.clearColor(0.5, 0.6, 0.8, 1)
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

  gl.cullFace(gl.FRONT_AND_BACK)

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

  const a = 1

  const mx = -1 + (1 * (uw - mw)) / uw
  const my = -1 + (1 * (uh - mh)) / uh

  // prettier-ignore
  const m = [
    a *2 / uw ,0,0,0,
    0,-a *2 / uh ,0,0,
    0,0,1,0,
    a *mx,-a *my,0,1,
  ]

  return m
}

export const createWebGL = (canvas: HTMLCanvasElement) => {
  const gl = initGL(canvas)

  const flatEntityDrawCall = createFlatEntity(gl)
  // const gridDrawCall = createGrid(gl)

  let worldMatrix

  window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth * pixelRatio
    canvas.height = canvas.clientHeight * pixelRatio
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    worldMatrix = null
  })

  return (universe: Universe, uistate: UIstate) => {
    worldMatrix = worldMatrix || computeWorldMatrix(universe.map)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    flatEntityDrawCall(universe, uistate, worldMatrix)
    // gridDrawCall(universe, uistate, worldMatrix)
  }
}
