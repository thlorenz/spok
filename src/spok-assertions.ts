import { SpokAssertions } from './types'

class SpokAssertionsClass implements SpokAssertions {
  /**
   * Specifies that the given number is within the given range,
   * i.e. `min<= x <=max`.
   *
   * ```js
   * var spec = {
   *  x: spok.range(1, 2)   // specifies that x should be >=1 and <=2
   * }
   * ```
   *
   * @function
   * @param {Number} min minimum
   * @param {Number} max maximum
   */
  range = (min: number, max: number) => {
    const checkRange = (x: number) => {
      return this.number(x) && min <= x && x <= max
    }

    checkRange.$spec = 'spok.range(' + min + ', ' + max + ')'
    checkRange.$description = min + ' <= value <= ' + max
    return checkRange
  }

  /**
   * Specifies that a number is greater than the given criteria.
   *
   * ```js
   * var spec = {
   *  x: spok.gt(1)  // specifies that x should be >1
   * }
   * ```
   *
   * @function
   * @param {Number} n criteria
   */
  gt = (n: number) => {
    const checkgt = (x: number) => {
      return this.number(x) && x > n
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
   * @function
   * @param {Number} n criteria
   */
  ge = (n: number) => {
    const checkge = (x: number) => {
      return this.number(x) && x >= n
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
   * @function
   * @param {Number} n criteria
   */
  lt = (n: number) => {
    const checklt = (x: number) => {
      return this.number(x) && x < n
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
   * @function
   * @param {Number} n criteria
   */
  le = (n: number) => {
    const checkle = (x: number) => {
      return this.number(x) && x <= n
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
   * @function
   * @param {unknown} value criteria
   */
  ne = (value: unknown) => {
    function checkne(x: unknown) {
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
   * @function
   */
  get gtz() {
    const fn = this.gt(0)
    fn.$spec = 'spok.gtz'
    fn.$description = 'value > 0'
    return fn
  }

  /**
   * Specifies that the value is greater or equal zero
   *
   * ```js
   * var spec = {
   *   x: spok.gez
   * }
   * ```
   * @function
   */
  get gez() {
    const fn = this.ge(0)
    fn.$spec = 'spok.gez'
    fn.$description = 'value >= 0'
    return fn
  }

  /**
   * Specifies that the value is less than zero
   *
   * ```js
   * var spec = {
   *   x: spok.ltz
   * }
   * ```
   * @function
   */
  get ltz() {
    const fn = this.lt(0)
    fn.$spec = 'spok.ltz'
    fn.$description = 'value < 0'
    return fn
  }

  /**
   * Specifies that the value is less or equal zero
   *
   * ```js
   * var spec = {
   *   x: spok.lez
   * }
   * ```
   * @function
   */
  get lez() {
    const fn = this.le(0)
    fn.$spec = 'spok.lez'
    fn.$description = 'value <= 0'
    return fn
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
   * @function
   * @param {String} t expected type
   */
  type = (t: string) => {
    function checkType(x: unknown) {
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
   * @function
   */
  get array() {
    const fn = function array(x: unknown[]) {
      return Array.isArray(x)
    }
    fn.$spec = 'spok.array'
    fn.$description = 'values is an Array'
    return fn
  }

  /**
   * Specifies that the input is an array with a specific number of elements
   *
   * var spec = {
   *  // specifies that x should be an Array with 2 elements
   *  x: spok.arrayElements(2)
   * }
   *
   * @function
   * @param {Number} n number of elements
   */
  arrayElements = (n: number) => {
    const checkCount = (array: unknown[]) => {
      if (array == null) {
        console.error('Expected %d, but found array to be null.', n)
        return false
      }
      const pass = this.array(array) && array.length === n
      if (!pass) {
        console.error('Expected %d, but found %d elements.', n, array.length)
      }
      return pass
    }

    checkCount.$spec = 'spok.arrayElements(' + n + ')'
    checkCount.$description = 'array has ' + n + ' element(s)'
    return checkCount
  }

  /**
   * Specifies that the input is an array with a number of elements
   * in a given range
   *
   * var spec = {
   *  // specifies that x should be an Array with 2-4 elements
   *  x: spok.arrayElementsRange(2, 4)
   * }
   *
   * @function
   * @param {Number} min min number of elements
   * @param {Number} max max number of elements
   */
  arrayElementsRange = (min: number, max: number) => {
    const checkCount = (array: unknown[]) => {
      if (array == null) {
        console.error(
          'Expected between %d and %d, but found array to be null.',
          min,
          max
        )
        return false
      }
      const pass =
        this.array(array) && array.length >= min && array.length <= max
      if (!pass) {
        console.error(
          'Expected between %d and %d, but found %d elements.',
          min,
          max,
          array.length
        )
      }
      return pass
    }

    checkCount.$spec = 'spok.arrayElementsRange(' + min + ', ' + max + ')'
    checkCount.$description =
      'array has between' + min + ' and ' + max + ' elements'
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
   * @function
   */
  get number() {
    const fn = function number(x: unknown) {
      return typeof x === 'number' && !isNaN(x)
    }
    fn.$spec = 'spok.number'
    fn.$description = 'value is a number'
    return fn
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
   * @function
   */
  get string() {
    const fn = this.type('string')
    fn.$spec = 'spok.string'
    fn.$description = 'value is a string'
    return fn
  }
  /**
   * Specifies that the input is a function.
   *
   * ```
   * var spec = {
   *   x: spok.function  // specifies that x should be a function
   * }
   * ```
   *
   * @function
   */
  get function() {
    const fn = this.type('function')
    fn.$spec = 'spok.function'
    fn.$description = 'value is a function'
    return fn
  }

  /**
   * Specifies that the input is an object and it is not `null`.
   *
   * ```js
   * var spec = {
   *  x: spok.definedObject  // specifies that x is a non-null object
   * }
   * ```
   *
   * @function
   */
  get definedObject() {
    const fn = function definedObject(x: unknown) {
      return x !== null && typeof x === 'object'
    }
    fn.$spec = 'spok.definedObject'
    fn.$description = 'value is defined and of type object'
    return fn
  }

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
   * @function
   * @param {String} what substring the given string should start with
   */
  startsWith = (what: string) => {
    function checkStartsWith(x: string) {
      const res =
        x != null && typeof x.startsWith === 'function' && x.startsWith(what)
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
   * @function
   * @param {String} what substring the given string should start with
   */
  endsWith = (what: string) => {
    function checkEndsWith(x: string) {
      const res =
        x != null && typeof x.endsWith === 'function' && x.endsWith(what)
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
   *  // specifies that x should match /hello$/
   *   x: spok.test(/hello$/)
   * }
   * ```
   *
   * @function
   * @param {RegExp} regex regular expression against
   * which the string is checked via `test`
   */
  test = (regex: RegExp) => {
    function checkTest(x: string) {
      const res = regex.test(x)
      if (!res) console.error('"%s" does not match \n%s', x, regex.toString())
      return res
    }

    const s = regex.toString()
    checkTest.$spec = 'spok.test(' + s + ')'
    checkTest.$description = 'value matches ' + s + ' regex'
    return checkTest
  }

  /**
   * Specifies that a value is defined,
   * i.e. it is neither `null` nor `undefined`.
   *
   * ```js
   * var spec = {
   *   x: spok.defined
   * }
   * ```
   *
   * @function
   */
  get defined() {
    const fn = function defined(x: unknown) {
      return x != null
    }
    fn.$spec = 'spok.defined'
    fn.$description = 'value is neither null nor undefined'
    return fn
  }

  /**
   * Specifies that a value is notDefined,
   * i.e. it is either `null` or `notDefined`.
   *
   * ```js
   * var spec = {
   *   x: spok.notDefined
   * }
   * ```
   *
   * @function
   */
  get notDefined() {
    const fn = function notDefined(x: unknown) {
      return x == null
    }
    fn.$spec = 'spok.notDefined'
    fn.$description = 'value is either null or undefined'
    return fn
  }
}

const x = new SpokAssertionsClass()

// Make all getters _own_ properties so they get copied during
// `Object.assign` calls
const spokAssertions = Object.assign({}, x, {
  gtz: x.gtz,
  gez: x.gez,
  ltz: x.ltz,
  lez: x.lez,
  array: x.array,
  number: x.number,
  string: x.string,
  function: x.function,
  definedObject: x.definedObject,
  defined: x.defined,
  notDefined: x.notDefined,
})
export default spokAssertions
