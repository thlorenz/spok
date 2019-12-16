import test from 'tape'
import spok from '../spok'

import { assert, equalCalls, init } from './utils'

test('\nproviding object key that does not exist on object', (t) => {
  init()
  const object = { foo: 1 }
  // @ts-ignore purposely adding extra property
  spok(assert, object, { foo: 1, bar: 2 })

  t.deepEqual(
    equalCalls,
    [
      { actual: 1, expected: 1, msg: 'foo = 1' },
      { actual: undefined, expected: 2, msg: 'bar = undefined' },
    ],
    'spok detects that actual does not have that property'
  )

  t.end()
})

test('\nproviding object key that does not exist on object inside array', (t) => {
  init()
  const object = [{ foo: 1 }]
  spok(assert, object, [{ foo: 1, bar: 2 }])
  t.deepEqual(
    equalCalls,
    [
      { actual: 1, expected: 1, msg: 'spok: 0' },
      { actual: 1, expected: 1, msg: '·· foo = 1' },
      { actual: undefined, expected: 2, msg: '·· bar = undefined' },
    ],
    'spok detects that object inside array does not have that property'
  )
  t.end()
})

test('\nproviding more array elements in spec than in object', (t) => {
  init()
  const object = [{ foo: 1 }]
  spok(assert, object, [{ foo: 1 }, { foo: 2 }])
  t.deepEqual(
    equalCalls,

    [
      { actual: 1, expected: 1, msg: 'spok: 0' },
      { actual: 1, expected: 1, msg: '·· foo = 1' },
      { actual: 1, expected: 1, msg: 'spok: 1' },
      {
        actual: 2,
        expected: undefined,
        msg:
          'property "foo" checked on null or undefined, this is most likely due to an array in the specs that has more items than the actual array',
      },
    ],
    'spok detects the problem and points it out in the error'
  )
  t.end()
})
