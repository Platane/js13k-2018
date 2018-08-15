import test from 'tape'
import { rayCastCheck } from '../index'

test('rayCastCheck : 1', t => {
  const A = { x: 0.5, y: 0.5 }
  const B = { x: 0.5, y: 4.5 }

  let path = []
  const check = c => {
    path.push(c)
    return true
  }
  rayCastCheck(check, A, B)

  t.deepEqual(
    path,
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 },
    ],
    'should check every cells'
  )

  t.end()
})

test('rayCastCheck : 2', t => {
  const A = { x: 0.5, y: 0.1 }
  const B = { x: -1.5, y: 0.8 }

  let path = []
  const check = c => {
    path.push(c)
    return true
  }
  rayCastCheck(check, A, B)

  t.deepEqual(
    path,
    [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 }],
    'should check every cells'
  )

  t.end()
})
