import colors from 'ansicolors'
import insp from './inspect'
import {
  Assert,
  Specifications,
  Spok,
  SpokConfig,
  SpokFunction,
} from './types'
import spokAssertions from './spok-assertions'
export * from './types'

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
const spokFunction: SpokFunction = <P>(
  t: Assert,
  obj: P,
  specifications: Specifications<P>,
  prefix: string | null = ''
) => {
  function check(k: string) {
    if (k === '$topic' || k === '$spec' || k === '$description') return

    // @ts-ignore
    const spec = specifications[k]
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
        return t.equal(!!spec!(val), true, msg)
      case 'boolean':
      case 'number':
      case 'string':
        return t.equal(val, spec, msg)
      case 'object':
        if (spec == null) return t.equal(val, spec, msg)
        if (!needRecurse(spec)) return t.deepEqual(val, spec, msg)

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
    t.equal(1, 1, prefix + 'spok: ' + specifications.$topic)
    prefix = prefix + '·· '
  }

  // check all specs
  Object.keys(specifications).forEach(check)

  // provide confirmation that spec is done
  if (spok.sound) {
    require('child_process').execSync('say spokie dokie -v Vicki -r 600')
  }
}

const spokConfig: SpokConfig = {
  printSpec: true,
  printDescription: false,
  sound: false,
  color: true,
}

const spok: Spok = Object.assign(spokFunction, spokAssertions, spokConfig)

export default spok
