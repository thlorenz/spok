'use strict'

const test = require('tape')
const spok = require('../dist/spok').default
spok.printSpec = false

// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, false))
}
var equalCalls
var deepEqualCalls

var assert = {
  equal: function(actual, expected, msg) {
    equalCalls.push({ actual: actual, expected: expected, msg: msg })
  },
  deepEqual: function(actual, expected, msg) {
    deepEqualCalls.push({ actual: actual, expected: expected, msg: msg })
  },
}

function init() {
  spok.color = false
  equalCalls = []
  deepEqualCalls = []
}

test('\nmultiple specifications all valid', function(t) {
  init()
  var object = {
    one: 1,
    two: 2,
    true: true,
    hello: 'hello',
    object: { foo: 'bar' },
    three: 3,
    four: 4,
    anyNum: 999,
    anotherNum: 888,
    anArray: [1, 2],
    anotherArray: [1, 2, 3],
    anObject: {},
  }

  var specs = {
    $topic: 'spok-test-valid',
    one: spok.ge(1),
    two: 2,
    true: true,
    hello: 'hello',
    object: { foo: 'bar' },
    three: spok.range(2, 4),
    four: spok.lt(5),
    anArray: spok.array,
    anotherArray: [1, 2, 3],
    anObject: spok.ne(undefined),
  }

  spok(assert, object, specs)

  t.deepEqual(
    equalCalls,
    [
      { actual: 1, expected: 1, msg: 'spok: spok-test-valid' },
      { actual: true, expected: true, msg: '·· one = 1' },
      { actual: 2, expected: 2, msg: '·· two = 2' },
      { actual: true, expected: true, msg: '·· true = true' },
      { actual: 'hello', expected: 'hello', msg: "·· hello = 'hello'" },
      { actual: 1, expected: 1, msg: '·· spok: spok-test-valid.object' },
      { actual: 'bar', expected: 'bar', msg: "·· ·· foo = 'bar'" },
      { actual: true, expected: true, msg: '·· three = 3' },
      { actual: true, expected: true, msg: '·· four = 4' },
      { actual: true, expected: true, msg: '·· anArray = [ 1, 2 ]' },
      { actual: true, expected: true, msg: '·· anObject = {}' },
    ],
    'spok performs the expected equality checks'
  )

  t.deepEqual(
    deepEqualCalls,
    [
      {
        actual: [1, 2, 3],
        expected: [1, 2, 3],
        msg: '·· anotherArray = [ 1, 2, 3 ]',
      },
    ],
    'spok performs the expected deep equality checks'
  )

  t.end()
})

test('\nmultiple specifications some invalid', function(t) {
  init()
  var object = {
    true: true,
    hello: 'hello',
    object: { foo: 'bar' },
    four: 4,
    anArray: [1, 2],
    anotherArray: [1, 2, 3],
  }

  var specs = {
    $topic: 'spok-test-invalid',
    true: true,
    hello: 'hell',
    object: { foo: 'bas' },
    four: spok.lt(3),
    anArray: spok.array,
    anotherArray: [1, 2, 3, 4],
  }

  spok(assert, object, specs)

  t.deepEqual(
    equalCalls,
    [
      { actual: 1, expected: 1, msg: 'spok: spok-test-invalid' },
      { actual: true, expected: true, msg: '·· true = true' },
      { actual: 'hello', expected: 'hell', msg: "·· hello = 'hello'" },
      { actual: 1, expected: 1, msg: '·· spok: spok-test-invalid.object' },
      { actual: 'bar', expected: 'bas', msg: "·· ·· foo = 'bar'" },
      { actual: false, expected: true, msg: '·· four = 4' },
      { actual: true, expected: true, msg: '·· anArray = [ 1, 2 ]' },
    ],
    'spok performs the expected equality checks'
  )

  t.deepEqual(
    deepEqualCalls,
    [
      {
        actual: [1, 2, 3],
        expected: [1, 2, 3, 4],
        msg: '·· anotherArray = [ 1, 2, 3 ]',
      },
    ],
    'spok performs the expected deep equality checks'
  )

  t.end()
})

// shim startsWith for older node versions
// consider doing this in spok proper?
if (spok.startsWith !== 'function') {
  spok.startsWith = function(s) {
    var r = new RegExp('^' + s)
    return function match(x) {
      return r.test(x)
    }
  }
}

test('\nnested specifications all valid', function(t) {
  init()
  var res = {
    $topic: 'user function',
    file: '/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js',
    line: 39,
    column: 17,
    inferredName: '',
    name: 'onread',
    location:
      'onread (/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js:39:17)',
    propertyPaths: [
      'open.resource.context.callback',
      'stat.resource.context.callback',
      'read.resource.context.callback',
      'close.resource.context.callback',
    ],
    args: {
      '0': null,
      '1': {
        type: 'Buffer',
        len: 6108,
        included: 18,
        val: {
          utf8: 'const test = requi',
          hex: '636f6e73742074657374203d207265717569',
        },
      },
      proto: 'Object',
    },
  }

  spok(assert, res, {
    $topic: 'spok-nested-all-valid',
    file: spok.test(/read-one-file/),
    line: 39,
    column: 17,
    inferredName: '',
    name: 'onread',
    location: spok.startsWith('onread'),
    propertyPaths: [
      'open.resource.context.callback',
      'stat.resource.context.callback',
      'read.resource.context.callback',
      'close.resource.context.callback',
    ],
    args: {
      '0': null,
      '1': {
        type: 'Buffer',
        len: spok.gt(1000),
        included: spok.lt(20),
        val: { utf8: spok.string, hex: '636f6e73742074657374203d207265717569' },
      },
      proto: 'Object',
    },
  })

  t.deepEqual(
    equalCalls,
    [
      { actual: 1, expected: 1, msg: 'spok: spok-nested-all-valid' },
      {
        actual: true,
        expected: true,
        msg:
          "·· file = '/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js'",
      },
      { actual: 39, expected: 39, msg: '·· line = 39' },
      { actual: 17, expected: 17, msg: '·· column = 17' },
      { actual: '', expected: '', msg: "·· inferredName = ''" },
      { actual: 'onread', expected: 'onread', msg: "·· name = 'onread'" },
      {
        actual: true,
        expected: true,
        msg:
          "·· location = 'onread (/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js:39:17)'",
      },
      { actual: 1, expected: 1, msg: '·· spok: spok-nested-all-valid.args' },
      { actual: null, expected: null, msg: '·· ·· 0 = null' },
      {
        actual: 1,
        expected: 1,
        msg: '·· ·· spok: spok-nested-all-valid.args.1',
      },
      { actual: 'Buffer', expected: 'Buffer', msg: "·· ·· ·· type = 'Buffer'" },
      { actual: true, expected: true, msg: '·· ·· ·· len = 6108' },
      { actual: true, expected: true, msg: '·· ·· ·· included = 18' },
      {
        actual: 1,
        expected: 1,
        msg: '·· ·· ·· spok: spok-nested-all-valid.args.1.val',
      },
      {
        actual: true,
        expected: true,
        msg: "·· ·· ·· ·· utf8 = 'const test = requi'",
      },
      {
        actual: '636f6e73742074657374203d207265717569',
        expected: '636f6e73742074657374203d207265717569',
        msg: "·· ·· ·· ·· hex = '636f6e73742074657374203d207265717569'",
      },
      { actual: 'Object', expected: 'Object', msg: "·· ·· proto = 'Object'" },
    ],
    'spok executes the correct equal calls'
  )
  // Mitigating inconsistencies between Node.js versions
  delete deepEqualCalls[0].msg

  t.deepEqual(
    deepEqualCalls,
    [
      {
        actual: [
          'open.resource.context.callback',
          'stat.resource.context.callback',
          'read.resource.context.callback',
          'close.resource.context.callback',
        ],
        expected: [
          'open.resource.context.callback',
          'stat.resource.context.callback',
          'read.resource.context.callback',
          'close.resource.context.callback',
        ],
      },
    ],
    'spok executes the correct equal calls'
  )
  t.end()
})

test('\nnested specifications in array', function(t) {
  init()
  var object = {
    objArray: [{ foo: 'bar' }, { bar: 'foo' }],
    numberArray: [1, 2],
    stringArray: ['h', 'e'],
    numberStringArray: [1, 2, 'h', 'e'],
  }

  var specs = {
    $topic: 'spok-test-nested-specs-in-array',
    objArray: [{ foo: spok.string }, { bar: 'foo' }],
    numberArray: [1, 2],
    stringArray: ['h', 'e'],
    numberStringArray: [spok.gtz, 2, spok.startsWith('h'), 'e'],
  }

  spok(assert, object, specs)

  t.deepEqual(
    equalCalls,
    [
      { actual: 1, expected: 1, msg: 'spok: spok-test-nested-specs-in-array' },
      {
        actual: 1,
        expected: 1,
        msg: '·· spok: spok-test-nested-specs-in-array.objArray',
      },
      {
        actual: 1,
        expected: 1,
        msg: '·· ·· spok: spok-test-nested-specs-in-array.objArray.0',
      },
      { actual: true, expected: true, msg: "·· ·· ·· foo = 'bar'" },
      {
        actual: 1,
        expected: 1,
        msg: '·· ·· spok: spok-test-nested-specs-in-array.objArray.1',
      },
      { actual: 'foo', expected: 'foo', msg: "·· ·· ·· bar = 'foo'" },
      {
        actual: 1,
        expected: 1,
        msg: '·· spok: spok-test-nested-specs-in-array.numberStringArray',
      },
      { actual: true, expected: true, msg: '·· ·· 0 = 1' },
      { actual: 2, expected: 2, msg: '·· ·· 1 = 2' },
      { actual: true, expected: true, msg: "·· ·· 2 = 'h'" },
      { actual: 'e', expected: 'e', msg: "·· ·· 3 = 'e'" },
    ],
    'spok executes correct equal calls'
  )

  t.deepEqual(
    deepEqualCalls,
    [
      { actual: [1, 2], expected: [1, 2], msg: '·· numberArray = [ 1, 2 ]' },
      {
        actual: ['h', 'e'],
        expected: ['h', 'e'],
        msg: "·· stringArray = [ 'h', 'e' ]",
      },
    ],
    'spok executes correct deep equal calls'
  )
  t.end()
})
