'use strict';

const test = require('tape');
const spok = require('../dist/spok').default;

test('\nspecifications in isolation', function(t) {
  // ranges and comparisons
  t.ok(spok.range(0, 2)(1), 'range 0, 2, 1');
  t.ok(spok.range(0, 2)(0), 'range 0, 2, 0');
  t.ok(spok.range(0, 2)(2), 'range 0, 2, 2');
  t.ok(!spok.range(0, 2)(-1), 'not range 0, 2, -1');
  t.ok(!spok.range(0, 2)(3), 'not range 0, 2, 3');
  t.ok(!spok.range(0, 2)(undefined), 'not range 0, 2, undefined');
  t.ok(!spok.range(0, 2)(null), 'range 0, 2, null');

  t.ok(spok.ge(0)(1), 'ge 0, 1');
  t.ok(spok.ge(1)(2), 'ge 1, 2');
  t.ok(spok.ge(1)(1), 'ge 1, 1');
  t.ok(!spok.ge(1)(0), 'not ge 1, 0');
  t.ok(!spok.ge(1)(null), 'not ge 1, null');
  t.ok(!spok.ge(1)(undefined), 'not ge 1, undefined');

  t.ok(spok.gt(0)(1), 'gt 0, 1');
  t.ok(spok.gt(1)(2), 'gt 1, 2');
  t.ok(!spok.gt(1)(1), 'not gt 1, 1');
  t.ok(!spok.gt(1)(0), 'not gt 1, 0');
  t.ok(!spok.gt(1)(null), 'not gt 1, null');
  t.ok(!spok.gt(1)(undefined), 'not gt 1, undefined');

  t.ok(spok.le(1)(0), 'le 1, 0');
  t.ok(spok.le(2)(1), 'le 2, 1');
  t.ok(spok.le(1)(1), 'le 1, 1');
  t.ok(!spok.le(0)(1), 'not le 0, 1');
  t.ok(!spok.le(1)(null), 'not le 1, null');
  t.ok(!spok.le(1)(undefined), 'not le 1, undefined');

  t.ok(spok.lt(1)(0), 'lt 1, 0');
  t.ok(spok.lt(2)(1), 'lt 2, 1');
  t.ok(!spok.lt(1)(1), 'not lt 1, 1');
  t.ok(!spok.lt(0)(1), 'not lt 0, 1');
  t.ok(!spok.lt(1)(null), 'not lt 1, null');
  t.ok(!spok.lt(1)(undefined), 'not lt 1, undefined');

  t.ok(spok.ne(1)(0), 'ne 1, 0');
  t.ok(spok.ne(1)('1'), 'ne 1, \'1\'');
  t.ok(!spok.ne(1)(1), 'not ne 1, 1');
  t.ok(spok.ne(1)(undefined), 'ne 1, undefined');
  t.ok(spok.ne(undefined)(1), 'ne undefined, 1');
  t.ok(!spok.ne(undefined)(undefined), 'not ne undefined, undefined');

  t.ok(spok.gez(1), 'gez 1');
  t.ok(spok.gez(0), 'gez 0');
  t.ok(!spok.gez(-1), 'not gez -1');
  t.ok(!spok.gez(null), 'not gez null');
  t.ok(!spok.gez(undefined), 'not gez undefined');

  t.ok(spok.gtz(1), 'gtz 1');
  t.ok(!spok.gtz(0), 'not gtz 0');
  t.ok(!spok.gtz(-1), 'not gtz -1');
  t.ok(!spok.gtz(null), 'not gtz null');
  t.ok(!spok.gtz(undefined), 'not gtz undefined');

  t.ok(spok.lez(-1), 'lez -1');
  t.ok(spok.lez(0), 'lez 0');
  t.ok(!spok.lez(1), 'not lez 1');
  t.ok(!spok.lez(null), 'not lez null');
  t.ok(!spok.lez(undefined), 'not lez undefined');

  t.ok(spok.ltz(-1), 'ltz -1');
  t.ok(!spok.ltz(0), 'not ltz 0');
  t.ok(!spok.ltz(1), 'not ltz 1');
  t.ok(!spok.ltz(null), 'not ltz null');
  t.ok(!spok.ltz(undefined), 'not ltz undefined');

  // types
  t.ok(spok.type('object')({}), 'type object, {}');
  t.ok(!spok.type('object')(1), 'not type object, 1');
  t.ok(spok.type('object')(null), 'type object, null');
  t.ok(!spok.type('object')(undefined), 'not type object, undefined');

  t.ok(spok.number(1), 'number 1');
  t.ok(!spok.number('1'), 'not number \'1\'');
  t.ok(!spok.number({}), 'not number {}');
  t.ok(!spok.number([]), 'not number []');
  t.ok(!spok.number(null), 'not number null');
  t.ok(!spok.number(undefined), 'not number undefined');

  t.ok(spok.string('hi'), 'string \'hi\'');
  t.ok(!spok.string(1), 'not string 1');
  t.ok(!spok.string({}), 'not string {}');
  t.ok(!spok.string([]), 'not string []');
  t.ok(!spok.string(null), 'not string null');
  t.ok(!spok.string(undefined), 'not string undefined');

  t.ok(spok.array([]), 'array []');
  t.ok(!spok.array({}), 'not array {}');
  t.ok(!spok.array(undefined), 'not array undefined');

  t.ok(spok.arrayElements(0)([]), 'arrayElements [] is 0');
  t.ok(!spok.arrayElements(0)({}), 'not array {}');
  t.ok(spok.arrayElements(1)([1]), 'arrayElements [ 1 ] is 1');
  t.ok(spok.arrayElements(2)([1, 2]), 'arrayElements [ 1, 2 ] is 2');
  t.ok(!spok.arrayElements(3)([1, 2]), 'arrayElements [ 1, 2 ] is not 3');

  t.ok(spok.arrayElementsRange(0, 1)([]),
    'arrayElementsRange [] is between 0 and 1');
  t.ok(!spok.arrayElementsRange(0, 1)({}), 'not array range {}');
  t.ok(spok.arrayElementsRange(0, 1)([1]),
    'arrayElementsRange [ 1 ] is between 0 and 1');
  t.ok(!spok.arrayElementsRange(2, 3)([1]),
    'arrayElementsRange [ 1 ] is not between 2 and 3');

  t.ok(spok.type('function')(function() {}), 'type function, function () {}');
  t.ok(!spok.type('function')(1), 'not type function, 1');
  t.ok(!spok.type('function')(null), 'not type function, null');
  t.ok(!spok.type('function')(undefined), 'not type function, undefined');

  t.ok(spok.definedObject({}), 'definedObject {}');
  t.ok(!spok.definedObject(1), 'not definedObject 1');
  t.ok(!spok.definedObject(null), 'not definedObject null');
  t.ok(!spok.definedObject(undefined), 'not definedObject undefined');

  // strings
  if (typeof ''.startsWith === 'function') {
    t.ok(spok.startsWith('hello')('hello world'),
      'startsWith hello, helloWorld');
    t.ok(!spok.startsWith('hallo')('hello world'),
      'startsWith hallo, helloWorld');
    t.ok(!spok.startsWith('hello')(null), 'startsWith hello, null');
    t.ok(!spok.startsWith('hello')(undefined), 'startsWith hello, undefined');
  }
  if (typeof ''.endsWith === 'function') {
    t.ok(spok.endsWith('world')('hello world'), 'endsWith world, helloWorld');
    t.ok(spok.endsWith('welt')('hello welt'), 'endsWith welt, helloWelt');
    t.ok(!spok.endsWith('hello')(null), 'not endsWith hello, null');
    t.ok(!spok.endsWith('hello')(undefined), 'not endsWith hello, undefined');
  }

  t.ok(spok.test(/hello$/)('world hello'), 'test /hello$/, "world hello"');
  t.ok(!spok.test(/hello$/)('hello world'), 'test /hello$/, "hello world"');
  t.ok(!spok.test(/hello$/)('world hello '), 'test /hello$/, "world hello "');

  t.ok(spok.defined(1), '1 is defined');
  t.ok(!spok.defined(null), 'null is not defined');
  t.ok(!spok.defined(undefined), 'undefined is not defined');

  t.ok(!spok.notDefined(1), '1 is not notDefined');
  t.ok(spok.notDefined(null), 'null is notDefined');
  t.ok(spok.notDefined(undefined), 'undefined is notDefined');
  t.end();
});
