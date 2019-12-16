import spok from '../spok'

export const equalCalls: { actual: any; expected: any; msg: string }[] = []
export const deepEqualCalls: { actual: any; expected: any; msg: string }[] = []

export const assert = {
  equal: (actual: any, expected: any, msg: string) => {
    equalCalls.push({ actual, expected, msg })
  },
  deepEqual: (actual: any, expected: any, msg: string) => {
    deepEqualCalls.push({ actual, expected, msg })
  },
}

export function init() {
  spok.color = false
  equalCalls.length = 0
  deepEqualCalls.length = 0
}
