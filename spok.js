'use strict';
var insp = require('./inspect')

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
module.exports = function spok(t, obj, specifications) {
  var prefix = ''

  function check(k) {
    var specString;
    if (k === '$topic') return;

    var spec = specifications[k]
    var val = obj[k]

    if (typeof spec === 'object') // includes array
      specString = insp(spec, spok.color);
    else
      specString = spec;

    var msg = prefix + k + ' = ' + insp(val, spok.color);

    switch (typeof spec) {
      case 'function': return t.equal(!!spec(val), true, msg);
      case 'boolean':
      case 'number':
      case 'string':
        return t.equal(val, spec, msg)
      case 'object': // includes Array
        return t.deepEqual(val, spec, msg)
      default:
        throw new Error('Type ' + typeof spec + ' not yet handled. Please submit a PR')
    }
  }

  if (specifications.$topic) {
    prefix = specifications.$topic + '.';
    // print indicator that a specific spec started being evaluated
    t.equal(1, 1, 'spok: ' + specifications.$topic)
  }

  // check all specs
  Object.keys(specifications).forEach(check);

  // print confirmation that spec is done
  t.equal(1, 1, 'spokie dokie')
  if (spok.sound) require('child_process').execSync('say spokie dokie -v Vicki -r 600')

}

var spok = module.exports;

spok.sound = false;
spok.color = true;

/**
 * Specififies that the given number is within the given range, i.e. `min<= x <=max`.
 *
 * ```js
 * var spec = {
 *  x: spok.range(1, 2)   // specifies that x should be >=1 and <=2
 * }
 * ```
 *
 * @name spok::range
 * @function
 * @param {Number} min minimum
 * @param {Number} max maximum
 */
spok.range = function range(min, max) {
  return function checkRange(x) {
    return spok.number(x) && min <= x && x <= max;
  }
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
 * @name spok::gt
 * @function
 * @param {Number} n criteria
 */
spok.gt = function gt(n) {
  return function checkgt(x) {
    return spok.number(x) && x > n;
  }
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
 * @name spok::ge
 * @function
 * @param {Number} n criteria
 */
spok.ge = function ge(n) {
  return function checkge(x) {
    return spok.number(x) && x >= n;
  }
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
 * @name spok::lt
 * @function
 * @param {Number} n criteria
 */
spok.lt = function lt(n) {
  return function checklt(x) {
    return spok.number(x) && x < n;
  }
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
 * @name spok::le
 * @function
 * @param {Number} n criteria
 */
spok.le = function le(n) {
  return function checkle(x) {
    return spok.number(x) && x <= n;
  }
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
 * @name spok::ne
 * @function
 * @param {Any} value criteria
 */
spok.ne = function ne(value) {
  return function checkne(x) {
    return value !== x
  }
}

/**
 * Specifies that the input is of a given type.
 *
 * ```js
 * var spec = {
 *  x: spok.type('number')  // specifies that x should be a Number
 * }
 * ```
 *
 * @name spok::type
 * @function
 * @param {String} t expected type
 */
spok.type = function type(t) {
  return function checkType(x) {
    return typeof x === t;
  }
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
 * @name spok::array
 * @function
 */
spok.array = function array(x) {
  return Array.isArray(x)
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
 * @name spok::number
 * @function
 */
spok.number = function number(x) {
  return typeof x === 'number' && !isNaN(x)
}

/**
 * Specifies that the input is a string.
 *
 * ```
 * var spec = {
 *   x: spok.string  // specifies that x should be a String
 * }
 * ```
 *
 * @name spok::string
 * @function
 */
spok.string = spok.type('string')

/**
 * Specifies that the input is an object and it is not `null`.
 *
 * ```js
 * var spec = {
 *  x: spok.definedObject  // specifies that x is a non-null object
 * }
 * ```
 *
 * @name spok::definedObject
 * @function
 */
spok.definedObject = function definedObject(x) {
  return x !== null && typeof x === 'object'
}

/**
 * Specifies that the string starts with the specified substring.
 * 
 * **NOTE**: only available with io.js which has an ES6 `startsWith` function
 *
 * ```js
 * var spec = {
 *  x: spok.startsWith('hello')  // specifies that x should start with 'hello'
 * }
 * ```
 *
 * @name spok::startsWith
 * @function
 * @param {String} what substring the given string should start with
 */
spok.startsWith = function startsWith(what) {
  return function checkStartsWith(x) {
    var res = x && typeof x.startsWith === 'function' && x.startsWith(what)
    if (!res) console.error('%s !==\n%s', x, what)
    return res
  }
}
