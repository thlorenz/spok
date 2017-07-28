'use strict'
var insp = require('./inspect')
var colors = require('ansicolors')

// only recurse into arrays if they contain actual specs or objects
function needRecurseArray(arr) {
  for (var i = 0; i < arr.length; i++) {
    var el = arr[i]
    if (typeof el !== 'number' && typeof el !== 'string' && el != null) return true
  }
  return false
}

function needRecurse(spec) {
  if (Array.isArray(spec)) return needRecurseArray(spec)
  var keys = Object.keys(spec)
  if (keys.length === 0) return false

  // if no spok functions are part of the spec, we could use deepEqual, but
  // we get a more fine grained output if we recurse even if the spec values
  // are constants
  return true
}

/**
 * Checks the given specifications against the object.
 *
 * When the tests are run the **actual** values are printed to verify visually while
 * each provided specification is validated and a test failure caused if one of them fails.
 *
 * @name spok
 * @function
 * @param {Object} t which has assertion functions `equal` and `deepEqual` (to compare objects) - use
 * **tap**, **tape**, **assert** or any other library that has those and thus is compatible
 * @param {Object} obj the object to verify the specifications against
 * @param {Object} specifications the specifications to verify
 */
module.exports = function spok(t, obj, specifications, prefix) {
  prefix = typeof prefix === 'string' ? prefix : ''

  function check(k) {
    if (k === '$topic' || k === '$spec' || k === '$description') return

    var spec = specifications[k]

    if (!obj) {
      return t.equal('undefined', spec, prefix + k + ' = ' + insp('undefined', spok.color) + ' ' + colors.brightBlack('satisfies: ' + spec.$spec))
    }

    var val = obj[k]

    var msg = prefix + k + ' = ' + insp(val, spok.color)
    if (spec != null) {
      if (spec.$spec == null && spec.name != null && spec.name.length > 0) {
        spec.$spec = spec.name
      }
      var ps = !!spok.printSpec && spec.$spec != null
      var pd = !!spok.printDescription && spec.$description != null
      if (ps) msg += '  ' + colors.brightBlack('satisfies: ' + spec.$spec)
      if (pd) msg += '  ' + colors.brightBlack(spec.$description)
    }

    switch (typeof spec) {
      case 'function': return t.equal(!!spec(val), true, msg)
      case 'boolean':
      case 'number':
      case 'string':
        return t.equal(val, spec, msg)
      case 'object':
        if (spec == null) return t.equal(val, spec, msg)
        if (!needRecurse(spec)) return t.deepEqual(val, spec, msg)

        if (spec.$topic == null) {
          var rootTopic = specifications.$topic != null ? specifications.$topic + '.' : ''
          spec.$topic = rootTopic + k
        }

        if (Array.isArray(spec)) {
          if (spec.length === 1) {
            var newSpec = val.map(function () {
              return spec[0]
            })
            newSpec.$topic = spec.$topic
            return spok(t, val, newSpec, prefix) 
          }
        }

        return spok(t, val, spec, prefix)
      default:
        throw new Error('Type ' + typeof spec + ' not yet handled. Please submit a PR')
    }
  }

  if (specifications.$topic) {
    // print indicator that a specific spec started being evaluated
    t.equal(1, 1, prefix + 'spok: ' + specifications.$topic)
    prefix = prefix + '·· '
  }

  // check all specs
  Object.keys(specifications).forEach(check)

  // provide confirmation that spec is done
  if (spok.sound) require('child_process').execSync('say spokie dokie -v Vicki -r 600')
}

var spok = module.exports

spok.printSpec = true
spok.printDescription = false
spok.sound = false
spok.color = true

/**
 * Specififies that the given number is within the given range, i.e. `min<= x <=max`.
 *
 * ```js
 * var spec = {
 *  x: spok.range(1, 2)   // specifies that x should be >=1 and <=2
 * }
 * ```
 *
 * @name spok.range
 * @function
 * @param {Number} min minimum
 * @param {Number} max maximum
 */
spok.range = function range(min, max) {
  function checkRange(x) {
    return spok.number(x) && min <= x && x <= max
  }
  checkRange.$spec = 'spok.range(' + min + ', ' + max + ')'
  checkRange.$description = min + ' <= value <= ' + max
  return checkRange
}

/**
 * Specififies that a number is greater than the given criteria.
 *
 * ```js
 * var spec = {
 *  x: spok.gt(1)  // specifies that x should be >1
 * }
 * ```
 *
 * @name spok.gt
 * @function
 * @param {Number} n criteria
 */
spok.gt = function gt(n) {
  function checkgt(x) {
    return spok.number(x) && x > n
  }
  checkgt.$spec = 'spok.gt(' + n + ')'
  checkgt.$description = 'value > ' + n
  return checkgt
}

/**
 * Specififies that a number is greater or equal the given criteria.
 *
 * ```js
 * var spec = {
 *  x: spok.ge(1)  // specifies that x should be >=1
 * }
 * ```
 *
 * @name spok.ge
 * @function
 * @param {Number} n criteria
 */
spok.ge = function ge(n) {
  function checkge(x) {
    return spok.number(x) && x >= n
  }
  checkge.$spec = 'spok.ge(' + n + ')'
  checkge.$description = 'value >= ' + n
  return checkge
}

/**
 * Specififies that a number is less than the given criteria.
 *
 * ```js
 * var spec = {
 *  x: spok.lt(1)  // specifies that x should be < 1
 * }
 * ```
 *
 * @name spok.lt
 * @function
 * @param {Number} n criteria
 */
spok.lt = function lt(n) {
  function checklt(x) {
    return spok.number(x) && x < n
  }
  checklt.$spec = 'spok.lt(' + n + ')'
  checklt.$description = 'value < ' + n
  return checklt
}

/**
 * Specififies that a number is less or equal the given criteria.
 *
 * ```js
 * var spec = {
 *  x: spok.le(1)  // specifies that x should be <=1
 * }
 * ```
 *
 * @name spok.le
 * @function
 * @param {Number} n criteria
 */
spok.le = function le(n) {
  function checkle(x) {
    return spok.number(x) && x <= n
  }
  checkle.$spec = 'spok.le(' + n + ')'
  checkle.$description = 'value <= ' + n
  return checkle
}

/**
 * Specifies that the value is not equal another.
 *
 * ```js
 * var spec = {
 *  x: spok.ne(undefined)  // specifies that x should be defined
 * }
 * ```
 *
 * @name spok.ne
 * @function
 * @param {Any} value criteria
 */
spok.ne = function ne(value) {
  function checkne(x) {
    return value !== x
  }
  checkne.$spec = 'spok.ne(' + value + ')'
  checkne.$description = 'value !== ' + value
  return checkne
}

/**
 * Specifies that the value is greater than zero
 *
 * ```js
 * var spec = {
 *   x: spok.gtz
 * }
 * ```
 * @name spok.gtz
 * @function
 */
spok.gtz = spok.gt(0)
spok.gtz.$spec = 'spok.gtz'
spok.gtz.$description = 'value > 0'

/**
 * Specifies that the value is greater or equal zero
 *
 * ```js
 * var spec = {
 *   x: spok.gez
 * }
 * ```
 * @name spok.gez
 * @function
 */
spok.gez = spok.ge(0)
spok.gez.$spec = 'spok.gez'
spok.gez.$description = 'value >= 0'

/**
 * Specifies that the value is less than zero
 *
 * ```js
 * var spec = {
 *   x: spok.ltz
 * }
 * ```
 * @name spok.ltz
 * @function
 */
spok.ltz = spok.lt(0)
spok.ltz.$spec = 'spok.ltz'
spok.ltz.$description = 'value < 0'

/**
 * Specifies that the value is less or equal zero
 *
 * ```js
 * var spec = {
 *   x: spok.lez
 * }
 * ```
 * @name spok.lez
 * @function
 */
spok.lez = spok.le(0)
spok.lez.$spec = 'spok.lez'
spok.lez.$description = 'value <= 0'

/**
 * Specifies that the input is of a given type.
 *
 * ```js
 * var spec = {
 *  x: spok.type('number')  // specifies that x should be a Number
 * }
 * ```
 *
 * @name spok.type
 * @function
 * @param {String} t expected type
 */
spok.type = function type(t) {
  function checkType(x) {
    return typeof x === t
  }
  checkType.$spec = 'spok.type(' + t + ')'
  checkType.$description = 'value is of type ' + t
  return checkType
}

/**
 * Specifies that the input is an array.
 *
 * ```js
 * var spec = {
 *  x: spok.array  // specifies that x should be an Array
 * }
 * ```
 *
 * @name spok.array
 * @function
 */
spok.array = function array(x) {
  return Array.isArray(x)
}
spok.array.$spec = 'spok.array'
spok.array.$description = 'values ia an Array'

/**
 * Specifies that the input is an array with a specific number of elements
 *
 * var spec = {
 *  x: spok.arrayElements(2)  // specifies that x should be an Array witn 2 elements
 * }
 *
 * @name spok.arrayElements
 * @function
 * @param {Number} n number of elements
 */
spok.arrayElements = function arrayElements(n) {
  function checkCount(array) {
    if (array == null) {
      return console.error('Expected %d, but found array to be null.', n)
    }
    var pass = spok.array(array) && array.length === n
    if (!pass) console.error('Expected %d, but found %d elements.', n, array.length)
    return pass
  }
  checkCount.$spec = 'spok.arrayElements(' + n + ')'
  checkCount.$description = 'array has ' + n + ' element(s)'
  return checkCount
}

/**
 * Specifies that the input of type number and `isNaN(x)` returns `false`.
 *
 * ```js
 * var spec = {
 *  x: spok.number  // specifies that x should be a Number
 * }
 * ```
 *
 * @name spok.number
 * @function
 */
spok.number = function number(x) {
  return typeof x === 'number' && !isNaN(x)
}
spok.number.$spec = 'spok.number'
spok.number.$description = 'value is a number'

/**
 * Specifies that the input is a string.
 *
 * ```
 * var spec = {
 *   x: spok.string  // specifies that x should be a String
 * }
 * ```
 *
 * @name spok.string
 * @function
 */
spok.string = spok.type('string')
spok.string.$spec = 'spok.string'
spok.string.$description = 'value is a string'

/**
 * Specifies that the input is a function.
 *
 * ```
 * var spec = {
 *   x: spok.function  // specifies that x should be a function
 * }
 * ```
 *
 * @name spok.function
 * @function
 */
spok.function = spok.type('function')
spok.function.$spec = 'spok.function'
spok.function.$description = 'value is a function'

/**
 * Specifies that the input is an object and it is not `null`.
 *
 * ```js
 * var spec = {
 *  x: spok.definedObject  // specifies that x is a non-null object
 * }
 * ```
 *
 * @name spok.definedObject
 * @function
 */
spok.definedObject = function definedObject(x) {
  return x !== null && typeof x === 'object'
}
spok.definedObject.$spec = 'spok.definedObject'
spok.definedObject.$description = 'value is defined and of type object'

/**
 * Specifies that the string starts with the specified substring.
 *
 * **NOTE**: only available with node.js which has an ES6 `startsWith` function
 *
 * ```js
 * var spec = {
 *  x: spok.startsWith('hello')  // specifies that x should start with 'hello'
 * }
 * ```
 *
 * @name spok.startsWith
 * @function
 * @param {String} what substring the given string should start with
 */
spok.startsWith = function startsWith(what) {
  function checkStartsWith(x) {
    var res = x && typeof x.startsWith === 'function' && x.startsWith(what)
    if (!res) console.error('"%s" does not start with "%s"', x, what)
    return res
  }
  checkStartsWith.$spec = 'spok.startsWith(' + what + ')'
  checkStartsWith.$description = 'string starts with ' + what
  return checkStartsWith
}

/**
 * Specifies that the string ends with the specified substring.
 *
 * **NOTE**: only available with node.js which has an ES6 `endsWith` function
 *
 * ```js
 * var spec = {
 *  x: spok.endsWith('hello')  // specifies that x should start with 'hello'
 * }
 * ```
 *
 * @name spok.endsWith
 * @function
 * @param {String} what substring the given string should start with
 */
spok.endsWith = function endsWith(what) {
  function checkEndsWith(x) {
    var res = x && typeof x.endsWith === 'function' && x.endsWith(what)
    if (!res) console.error('"%s" does not start with "%s"', x, what)
    return res
  }
  checkEndsWith.$spec = 'spok.endsWith(' + what + ')'
  checkEndsWith.$description = 'string ends with ' + what
  return checkEndsWith
}

/**
 * Specifies that the string needs to match the given regular expression.
 *
 * ```js
 * var spec = {
 *   x: spok.test(/hello$/) // specifies that x should match /hello$/
 * }
 * ```
 *
 * @name spok.test
 * @function
 * @param {RegExp} regex regular expression against which the string is checked via `test`
 */
spok.test = function test(regex) {
  function checkTest(x) {
    var res = regex.test(x)
    if (!res) console.error('"%s" does not match \n%s', x, regex.toString())
    return res
  }
  var s = regex.toString()
  checkTest.$spec = 'spok.test(' + s + ')'
  checkTest.$description = 'value matches ' + s + ' regex'
  return checkTest
}

/**
 * Specifies that a value is defined, i.e. it is neither `null` nor `undefined`.
 *
 * ```js
 * var spec = {
 *   x: spok.defined
 * }
 * ```
 *
 * @name spok.defined
 * @function
 */
spok.defined = function defined(x) {
  return x != null
}
spok.defined.$spec = 'spok.defined'
spok.defined.$description = 'value is neither null nor undefined'

/**
 * Specifies that a value is notDefined, i.e. it is either `null` or `notDefined`.
 *
 * ```js
 * var spec = {
 *   x: spok.notDefined
 * }
 * ```
 *
 * @name spok.notDefined
 * @function
 */
spok.notDefined = function notDefined(x) {
  return x == null
}
spok.notDefined.$spec = 'spok.notDefined'
spok.notDefined.$description = 'value is either null or undefined'
