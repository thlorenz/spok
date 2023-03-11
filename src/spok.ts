import colors from 'ansicolors'
import { strict as assert } from 'assert'
import insp from './inspect'
import spokAssertions from './spok-assertions'
import {
  Assert,
  Specifications,
  Spok,
  SpokConfig,
  SpokFunction,
  SpokFunctionAny,
} from './types'
import { isTestContext, TestContext } from './types-internal'

export * from './types'
import { chaiExpect } from './adapter-chai-expect'

// only recurse into arrays if they contain actual specs or objects
function needRecurseArray(arr: Array<number | string | null>): boolean {
  for (const el of arr) {
    if (typeof el !== 'number' && typeof el !== 'string' && el != null) {
      return true
    }
  }
  return false
}

function needRecurse(
  spec: Array<number | string | null> | number | string | null
): boolean {
  if (Array.isArray(spec)) return needRecurseArray(spec)
  if (spec == null) return false
  const keys = Object.keys(spec)
  if (keys.length === 0) return false

  // if no spok functions are part of the spec, we could use deepEqual, but
  // we get a more fine grained output if we recurse even if the spec values
  // are constants
  return true
}

/**
 * Checks the given specifications against the object.
 *
 * When the tests are run the **actual** values are printed
 * to verify visually while each provided specification is validated
 * and a test failure caused if one of them fails.
 *
 * @function
 *
 * @param {Object} t which has assertion functions `equal` and
 * `deepEqual` (to compare objects) - use * **tap**, **tape**,
 * **assert** or any other library that has those and thus is compatible
 *
 * @param {Object} obj the object to verify the specifications against
 * @param {Specifications} specifications the specifications to verify
 * @param {String } prefix added to messages
 */
const spokFunction: SpokFunction = <T>(
  t: Assert | TestContext,
  obj: T,
  specifications: Specifications<T>,
  prefix: string | null = ''
) => {
  const isCtx = isTestContext(t)
  const _assert = isCtx ? assert : t

  function check(k: string) {
    if (k === '$topic' || k === '$spec' || k === '$description') return

    // @ts-ignore
    const spec = specifications[k]
    if (obj == null) {
      let summary = `property "${k}" checked on null or undefined`
      let description =
        ', this is most likely due to an array in' +
        ' the specs that has more items than the actual array'
      if (spok.color) {
        summary = colors.red(summary)
        description = colors.brightBlack(description)
      }
      const msg = `${summary}${description}`

      if (isCtx) t.diagnostic(msg)
      return _assert.equal(spec, obj, msg)
    }
    // @ts-ignore
    const val = obj[k]

    let msg = prefix + k + ' = ' + insp(val, spok.color)
    if (spec != null) {
      if (spec.$spec == null && spec.name != null && spec.name.length > 0) {
        spec.$spec = spec.name
      }
      const ps = spok.printSpec && spec.$spec != null
      const pd = spok.printDescription && spec.$description != null
      if (ps) msg += '  ' + colors.brightBlack('satisfies: ' + spec.$spec)
      if (pd) msg += '  ' + colors.brightBlack(spec.$description)
    }

    switch (typeof spec) {
      case 'function':
        if (isCtx) t.diagnostic(msg)
        return _assert.equal(!!spec!(val), true, msg)
      case 'boolean':
      case 'number':
      case 'string':
        if (isCtx) t.diagnostic(msg)
        return _assert.equal(val, spec, msg)
      case 'object':
        if (spec == null) {
          if (isCtx) t.diagnostic(msg)
          return _assert.equal(val, spec, msg)
        }
        if (!needRecurse(spec)) {
          if (isCtx) t.diagnostic(msg)
          return _assert.deepEqual(val, spec, msg)
        }

        if (spec.$topic == null) {
          const rootTopic =
            specifications.$topic != null ? specifications.$topic + '.' : ''
          spec.$topic = rootTopic + k
        }
        return spok(t, val, spec, prefix)
      default:
        throw new Error(
          'at key "' +
            k +
            '" Type ' +
            typeof spec +
            ' not yet handled. Please submit a PR'
        )
    }
  }

  if (specifications.$topic != null) {
    // print indicator that a specific spec started being evaluated
    const msg = prefix + 'spok: ' + specifications.$topic
    if (isCtx) {
      t.diagnostic(msg)
    } else {
      _assert.equal(1, 1, msg)
    }
    prefix = prefix + '·· '
  }

  // check all specs
  Object.keys(specifications).forEach(check)

  // provide confirmation that spec is done
  if (spok.sound) {
    require('child_process').execSync('say spokie dokie -v Vicki -r 600')
  }
}

/**
 * Version of `spok` that is less strict about the relation of the
 * specification type, namely it allows overriding the type manually or
 * derives it from the supplied parameter.
 *
 * Use ONLY when you cannot adjust the types, so plain `spok` works.
 *
 */
const spokFunctionAny: SpokFunctionAny = <P extends object, T>(
  t: Assert,
  obj: T,
  specifications: P,
  prefix: string | null = ''
) => {
  return spokFunction(t, obj, specifications, prefix)
}

const spokConfig: SpokConfig = {
  printSpec: true,
  printDescription: false,
  sound: false,
  color: true,
}

const spok: Spok = Object.assign(
  spokFunction,
  { any: spokFunctionAny },
  spokAssertions,
  spokConfig,
  { adapters: { chaiExpect } }
)

export default spok
