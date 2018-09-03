import test from 'tape'
import { closestPointOnSegment } from '../index'
import type { Machine } from '~/type'

test('closestPointOnSegment: 1', t => {
  const A = { x: 0, y: 0 }
  const N = { x: 1, y: 0 }
  const P = { x: 0.4, y: 10 }

  const X = closestPointOnSegment(A, N, P)

  t.deepEqual(X, { x: 0.4, y: 0 }, 'should get point on segment')

  t.end()
})

test('closestPointOnSegment: 2', t => {
  const A = { x: 0, y: 0 }
  const N = { x: 1, y: 0 }
  const P = { x: -0.4, y: 10 }

  const X = closestPointOnSegment(A, N, P)

  t.deepEqual(X, { x: 0, y: 0 }, 'should get point on segment')

  t.end()
})

test('closestPointOnSegment: 3', t => {
  const A = { x: 0, y: 0 }
  const N = { x: 1, y: 0 }
  const P = { x: 2.4, y: 10 }

  const X = closestPointOnSegment(A, N, P)

  t.deepEqual(X, { x: 1, y: 0 }, 'should get point on segment')

  t.end()
})
