import test from 'tape'
import { proj, unproj } from '../index'

test('proj / unproj', t => {
  const A = { x: 0.5, y: 12.6 }
  const camera = { a: 3, t: { x: 7.5, y: 3 } }

  t.deepEqual(
    proj(camera)(unproj(camera)(A)),
    A,
    'proj / unproj should be identity'
  )

  t.end()
})
