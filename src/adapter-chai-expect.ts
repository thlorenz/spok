import spok, { Assert } from './spok'

declare var window: any
declare var expect: ExpectFn<any>

export type ExpectFn<T> = (
  actual: T,
  desc?: string
) => {
  equal(expected: Partial<T>): void
  deep: {
    include(expected: Partial<T>): void
  }
}

export function chaiExpect(expectFn: ExpectFn<any> = expect) {
  const adapter: Assert = {
    equal: (a, b, desc) => expectFn(a, desc).equal(b),
    deepEqual: (a, b, desc) => expectFn(a, desc).deep.include(b),
  }
  if (typeof window !== 'undefined') {
    spok.color = false
    spok.printDescription = false
  }

  return adapter
}
