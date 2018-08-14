import test from 'tape'
import { findPath } from '../index'
import { distance } from '~/service/map'
import type { Point } from '~/type'

const isContinuous = ([a, b, ...path]: Point[]) =>
  !b ? true : distance(a, b) <= 1 && isContinuous([b, ...path])

test('aStar : 1', t => {
  const map = [
    //
    [0, 0],
    [0, 0],
  ]

  const A = { x: 0, y: 0 }
  const B = { x: 1, y: 1 }

  const path: any = findPath(map, A, B)

  t.assert(path, 'path should exist')

  t.assert(isContinuous(path), 'path should be continuous')

  t.assert(distance(A, path[0]) === 0, 'path should start with A')

  t.assert(distance(B, path[path.length - 1]) === 0, 'path should start with B')

  t.end()
})

test('aStar : 2', t => {
  const map = [
    //
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  ]

  const A = { x: 1, y: 3 }
  const B = { x: 8, y: 9 }

  const path: any = findPath(map, A, B)

  t.assert(path, 'path should exist')

  t.assert(isContinuous(path), 'path should be continuous')

  t.assert(distance(A, path[0]) === 0, 'path should start with A')

  t.assert(distance(B, path[path.length - 1]) === 0, 'path should start with B')

  t.end()
})
