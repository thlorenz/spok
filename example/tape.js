var test = require('tape')
var spok = require('../')

// this would be returned from a function you are testing
var object = {
    one          : 1
  , two          : 2
  , three        : 3
  , four         : 4
  , helloWorld   : 'hello world'
  , anyNum       : 999
  , anotherNum   : 888
  , anArray      : [ 1, 2 ]
  , anotherArray : [ 1, 2, 3 ]
  , anObject     : {}
}

// custom specification
function hasThreeElements(a) {
  return a.length === 3
}

test('my object meets the specifications', function(t) {
  spok(t, object, {
      $topic      : 'spok-example'
    , one          : spok.ge(1)
    , two          : 2
    , three        : spok.range(2, 4)
    , four         : spok.lt(5)
    , helloWorld   : spok.startsWith('hello')
    , anyNum       : spok.type('number')
    , anotherNum   : spok.number
    , anArray      : spok.array
    , anotherArray : hasThreeElements
    , anObject     : spok.ne(undefined)
  })
  t.end()
})

test('\n#my object meets the specifications - print description', function(t) {
  spok.printDescription = true
  spok(t, object, {
      $topic      : 'spok-example'
    , one          : spok.ge(1)
    , two          : 2
    , three        : spok.range(2, 4)
    , four         : spok.lt(5)
    , helloWorld   : spok.startsWith('hello')
    , anyNum       : spok.type('number')
    , anotherNum   : spok.number
    , anArray      : spok.array
    , anotherArray : hasThreeElements
    , anObject     : spok.ne(undefined)
  })
  t.end()
})
