import { mat4, vec3 } from 'gl-matrix'
import type { Vec3 } from 'gl-matrix'
import type { Point } from '~/type'

type Camera = {
  r: number,
  center: Point,

  phy: number,
  rho: number,
}

const up = vec3.create()
vec3.set(up, 0, 0, 1)

const w = vec3.create()
const u = vec3.create()
const v = vec3.create()

const c = vec3.create()
const cam = vec3.create()

const m = mat4.create()
const tmp = mat4.create()
const rot = mat4.create()

// frustrumMatrix
const near = 0.01
const far = 150

let fovx = Math.PI / 2.2
let aspect = window.innerWidth / window.innerHeight

const frustrumMatrix = mat4.create()
mat4.perspective(frustrumMatrix, fovx, aspect, near, far)

export const buildWorldMatrix = ({ phy, rho, r, center }: Camera) => {
  // lookAt vector
  vec3.set(
    w,
    Math.cos(phy) * Math.cos(rho),
    Math.cos(phy) * Math.sin(rho),
    Math.sin(phy)
  )

  // build the base u,v,w

  vec3.cross(u, up, w)
  vec3.normalize(u, u)

  vec3.cross(v, u, w)

  // build the rotation
  // prettier-ignore
  mat4.set(
      rot,
      u[0]    , u[1]    , u[2]    , 0,
      v[0]    , v[1]    , v[2]    , 0,
      -w[0]   , -w[1]   , -w[2]   , 0,
      0       , 0       , 0       , 1,
  )

  mat4.invert(rot, rot)

  vec3.set(c, -center.x, -center.y, 0)

  vec3.scaleAndAdd(cam, c, w, r)

  mat4.identity(m)
  mat4.multiply(m, m, frustrumMatrix)
  mat4.multiply(m, m, rot)
  mat4.multiply(m, m, mat4.fromTranslation(tmp, cam))

  // mat4.multiply(m, m, mat4.fromTranslation(tmp, c))

  return m
}

export const camera = {
  rho: 0,
  phy: 0.4,
  r: 28,
  center: { x: 27 / 2, y: 18 / 2 },
}

document.body.addEventListener('mousemove', event => {
  const { width, height } = event.currentTarget.getBoundingClientRect()

  camera.rho = (event.clientX / width) * Math.PI * 2
  camera.phy = 0.4 - (event.clientY / height - 0.5) * 0.4
})
