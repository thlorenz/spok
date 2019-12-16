import { expectAssignable, expectError, expectNotAssignable } from 'tsd'
import { assert } from '../src/__tests__/utils'
import spok, { Specifications } from './spok'

//
// Simple Object
{
  const actual = {
    one: 1,
    two: 2,
    true: true,
    hello: 'hello',
  }
  type S = Specifications<typeof actual>

  expectAssignable<S>({
    $topic: 'spok-test-valid',
    one: spok.ge(1),
    two: 2,
  })
  expectAssignable<S>({
    one: spok.ge(1),
    two: spok.range(1, 2),
  })
  expectNotAssignable<S>({
    one: 'string',
    two: 2,
  })
  expectNotAssignable<S>({
    one: 1,
    twwo: 2,
  })
  expectNotAssignable<S>({
    one: [1],
    two: 2,
  })
  expectNotAssignable<S>({
    one: spok.ge(1),
    two: spok.range(1, 2),
    true: false,
    hello: Buffer.from('hello'),
  })
  expectAssignable<S>({})
  expectNotAssignable<S>(null)
  expectNotAssignable<S>(void 0)
}

//
// Array primitives
//
{
  const actual = [1, 2, 3]
  type S = Specifications<typeof actual>

  expectAssignable<S>([])
  expectAssignable<S>([2, 3, 4])
  expectAssignable<S>([1, 2, 3, 4])
  expectAssignable<S>([1])
  expectAssignable<S>([spok.number])
  expectAssignable<S>([spok.range(0, 2)])

  expectNotAssignable<S>({})
  expectNotAssignable<S>([{}])
  expectNotAssignable<S>(['string'])
}

//
// Array objects
//
{
  const actual = [{ foo: 1, bar: 'ber' }, { shoes: 2 }]

  const actualConst = [{ foo: 1, bar: 'ber' }, { shoes: 2 }] as const

  type S = Specifications<typeof actual>
  type SC = Specifications<typeof actualConst>

  expectAssignable<S>([])
  expectAssignable<SC>([])

  expectNotAssignable<S>([1])
  expectNotAssignable<SC>([1])

  expectAssignable<S>([{ foo: spok.number, bar: 'bar' }])
  expectNotAssignable<SC>([{ foo: spok.number, bar: 'bar' }])
  expectAssignable<SC>([{ foo: spok.number, bar: spok.endsWith('x') }])

  expectAssignable<S>([{ shoes: spok.number }])
  expectAssignable<SC>([{ shoes: spok.number }])
  expectAssignable<S>([{ shoes: 2 }])
  expectNotAssignable<SC>([{ shoes: 2 }])
  expectAssignable<SC>([{ shoes: spok.range(1, 2) }])
}
//
// Mixed Arrays Props
//
{
  const actual = {
    numberStringArray: [1, 2, 'h', 'e'],
  }
  const actualConst = {
    numberStringArray: [1, 2, 'h', 'e'],
  } as const

  type S = Specifications<typeof actual>
  type SC = Specifications<typeof actualConst>
  expectAssignable<S>({
    numberStringArray: [spok.gtz, 2, spok.startsWith('l'), 'e'],
  })
  expectAssignable<SC>({
    numberStringArray: [spok.gtz, 2, spok.startsWith('l'), 'e'],
  })

  expectAssignable<S>({
    numberStringArray: [spok.startsWith('h'), 'e'],
  })

  // using `as const` enables checking types per slot
  // non-const allows any of the types in any slot
  expectNotAssignable<SC>({
    numberStringArray: [spok.startsWith('h'), 'e'],
  })
}

//
// Nested Objects
//
{
  const actual = {
    country: {
      peru: {
        capital: 'lima',
        cities: {
          arequipa: {
            mountains: true,
            beach: 'nope',
          },
          mancora: {
            mountains: false,
            beach: 'pretty',
          },
        },
        landscapes: [
          { name: 'sierra', warm: false },
          { name: 'selba', warm: true },
        ],
      },
    },
  }

  const actualConst = {
    country: {
      peru: {
        capital: 'lima',
        cities: {
          arequipa: {
            mountains: true,
            beach: 'nope',
          },
          mancora: {
            mountains: false,
            beach: 'pretty',
          },
        },
        landscapes: [
          { name: 'sierra', warm: false },
          { name: 'selba', warm: true },
        ],
      },
    },
  } as const

  type S = Specifications<typeof actual>
  type SC = Specifications<typeof actualConst>

  expectAssignable<S>({})
  expectAssignable<SC>({})

  expectAssignable<S>({ country: {} })
  expectAssignable<SC>({ country: {} })

  expectNotAssignable<S>({ land: {} })
  expectNotAssignable<SC>({ land: {} })

  expectAssignable<S>({ country: { peru: {} } })
  expectAssignable<SC>({ country: { peru: {} } })

  expectNotAssignable<S>({ country: { bolivia: {} } })
  expectNotAssignable<SC>({ country: { bolivia: {} } })

  expectAssignable<S>({ country: { peru: { capital: spok.startsWith('l') } } })
  expectAssignable<SC>({ country: { peru: { capital: spok.startsWith('l') } } })
  expectAssignable<S>({ country: { peru: { capital: 'no idea' } } })
  expectNotAssignable<SC>({ country: { peru: { capital: 'no idea' } } })

  expectAssignable<S>({ country: { peru: { cities: {} } } })
  expectAssignable<SC>({ country: { peru: { cities: {} } } })

  expectNotAssignable<S>({ country: { peru: { states: {} } } })
  expectNotAssignable<SC>({ country: { peru: { states: {} } } })

  expectAssignable<S>({ country: { peru: { cities: { arequipa: {} } } } })
  expectAssignable<SC>({ country: { peru: { cities: { mancora: {} } } } })

  expectNotAssignable<S>({ country: { peru: { cities: { medellin: {} } } } })
  expectNotAssignable<SC>({ country: { peru: { cities: { bogota: {} } } } })

  expectAssignable<S>({
    country: { peru: { cities: { arequipa: { mountains: false } } } },
  })
  expectNotAssignable<SC>({
    country: { peru: { cities: { mancora: { mountains: true } } } },
  })
  expectNotAssignable<S>({
    country: { peru: { cities: { arequipa: { mountains: spok.le(2) } } } },
  })

  expectAssignable<S>({
    country: { peru: { cities: { arequipa: { beach: 'yes' } } } },
  })
  expectNotAssignable<SC>({
    country: { peru: { cities: { arequipa: { beach: 'yes' } } } },
  })
  expectNotAssignable<S>({
    country: { peru: { cities: { arequipa: { beach: true } } } },
  })

  expectAssignable<S>({
    country: { peru: { landscapes: [] } },
  })
  expectNotAssignable<S>({
    country: { peru: { landscapes: true } },
  })

  expectAssignable<S>({
    country: { peru: { landscapes: [{ name: spok.string, warm: false }] } },
  })
  expectAssignable<SC>({
    country: { peru: { landscapes: [{ name: spok.string, warm: false }] } },
  })
  expectAssignable<S>({
    country: { peru: { landscapes: [{ name: spok.string, warm: true }] } },
  })
  expectNotAssignable<SC>({
    country: { peru: { landscapes: [{ name: spok.string, warm: true }] } },
  })
  expectAssignable<S>({
    country: {
      peru: {
        landscapes: [
          { name: spok.string, warm: true },
          { name: spok.startsWith('sel'), warm: spok.type('boolean') },
        ],
      },
    },
  })
  expectAssignable<SC>({
    country: {
      peru: {
        landscapes: [
          { name: spok.string, warm: false },
          { name: spok.startsWith('sel'), warm: spok.type('boolean') },
        ],
      },
    },
  })

  expectAssignable<S>({
    country: {
      peru: {
        landscapes: [
          { name: spok.string, warm: true },
          { name: spok.startsWith('sel'), warm: spok.type('boolean') },
          { name: spok.string },
        ],
      },
    },
  })
  expectNotAssignable<SC>({
    country: {
      peru: {
        landscapes: [
          { name: spok.string, warm: true },
          { name: spok.startsWith('sel'), warm: spok.type('boolean') },
          { name: spok.string },
        ],
      },
    },
  })
}

//
// Types with optional properties
//
{
  type ColumnInfo = {
    column?: number
  }

  const actual: ColumnInfo = {
    column: 2,
  }

  type S = Specifications<typeof actual>

  expectAssignable<S>({
    column: spok.ge(1),
  })
}

//
// Overriding spec type
//
{
  const actual = { foo: 1 }
  expectError(() => spok(assert, actual, { foo: '1' }))
  spok.any(assert, actual, { foo: '1' })
}
