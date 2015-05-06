'use strict';

var test = require('tape')
var spok = require('../')

var equalCalls;
var deepEqualCalls;

var assert = {
    equal: function (actual, expected, msg) {
      equalCalls.push({ actual: actual, expected: expected, msg: msg })
    }
  , deepEqual: function (actual, expected, msg) {
      deepEqualCalls.push({ actual: actual, expected: expected, msg: msg })
    }
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function init() {
  spok.color = false;
  equalCalls = [];
  deepEqualCalls = [];
}

test('\nmultiple specifications all valid', function (t) {
  init();
  var object = {
      one          : 1
    , two          : 2
    , true         : true
    , hello        : 'hello'
    , object       : { foo: 'bar' }
    , three        : 3
    , four         : 4
    , anyNum       : 999
    , anotherNum   : 888
    , anArray      : [ 1, 2 ]
    , anotherArray : [ 1, 2, 3 ]
    , anObject     : {}
  }

  var specs = {
      $topic      : 'spok-test-valid'
    , one          : spok.ge(1)
    , two          : 2
    , true         : true
    , hello        : 'hello'
    , object       : { foo: 'bar' }
    , three        : spok.range(2, 4)
    , four         : spok.lt(5)
    , anArray      : spok.array
    , anotherArray : [ 1, 2, 3 ]
    , anObject     : spok.ne(undefined)
  }

  spok(assert, object, specs);

  t.deepEqual(equalCalls,
    [ { actual: 1, expected: 1, msg: 'spok: spok-test-valid' },
      { actual: true, expected: true, msg: '··· one = 1' },
      { actual: 2, expected: 2, msg: '··· two = 2' },
      { actual: true, expected: true, msg: '··· true = true' },
      { actual: 'hello',
        expected: 'hello',
        msg: '··· hello = \'hello\'' },
      { actual: true, expected: true, msg: '··· three = 3' },
      { actual: true, expected: true, msg: '··· four = 4' },
      { actual: true,
        expected: true,
        msg: '··· anArray = [ 1, 2 ]' },
      { actual: true, expected: true, msg: '··· anObject = {}' } ]
    , 'spok performs the expected equality checks'
  )

  t.deepEqual(deepEqualCalls,
    [ { actual: { foo: 'bar' },
        expected: { foo: 'bar' },
        msg: '··· object = { foo: \'bar\' }' },
      { actual: [ 1, 2, 3 ],
        expected: [ 1, 2, 3 ],
        msg: '··· anotherArray = [ 1, 2, 3 ]' } ]
    , 'spok performs the expected deep equality checks'
  )

  t.end()

})

test('\nmultiple specifications some  invalid', function (t) {
  init();
  var object = {
      true         : true
    , hello        : 'hello'
    , object       : { foo: 'bar' }
    , four         : 4
    , anArray      : [ 1, 2 ]
    , anotherArray : [ 1, 2, 3 ]
  }

  var specs = {
      $topic      : 'spok-test-invalid'
    , true         : true
    , hello        : 'hell'
    , object       : { foo: 'bas' }
    , four         : spok.lt(3)
    , anArray      : spok.array
    , anotherArray : [ 1, 2, 3, 4 ]
  }

  spok(assert, object, specs);

  t.deepEqual(equalCalls,
    [ { actual: 1, expected: 1, msg: 'spok: spok-test-invalid' },
      { actual: true,
        expected: true,
        msg: '··· true = true' },
      { actual: 'hello',
        expected: 'hell',
        msg: '··· hello = \'hello\'' },
      { actual: false,
        expected: true,
        msg: '··· four = 4' },
      { actual: true,
        expected: true,
        msg: '··· anArray = [ 1, 2 ]' } ]
    , 'spok performs the expected equality checks'
  )

  t.deepEqual(deepEqualCalls,
    [ { actual: { foo: 'bar' },
        expected: { foo: 'bas' },
        msg: '··· object = { foo: \'bar\' }' },
      { actual: [ 1, 2, 3 ],
        expected: [ 1, 2, 3, 4 ],
        msg: '··· anotherArray = [ 1, 2, 3 ]' } ]
    , 'spok performs the expected deep equality checks'
  )

  t.end()
})
