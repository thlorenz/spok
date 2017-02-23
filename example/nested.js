var test = require('tape')
var spok = require('../')

const res =   {
    $topic: 'user function'
  , file: '/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js'
  , line: 39
  , column: 17
  , inferredName: ''
  , name: 'onread'
  , location: 'onread (/Volumes/d/dev/js/async-hooks/ah-fs/test/read-one-file.js:39:17)'
  , propertyPaths:
    [ 'open.resource.context.callback'
    , 'close.resource.context.callback' ]
  , args:
    { '0': null
    , '1':
      { type: 'Buffer'
      , len: 6108
      , included: 18
      , val:
          { utf8: 'const test = requi'
          , hex: '636f6e73742074657374203d207265717569' } }
    , proto: 'Object' }
}

test('\nspok handles nested specifications', function(t) {
  spok(t, res, {
      $topic: 'result'
    , file: spok.test(/read-one-file/)
    , line: 39
    , column: 17
    , inferredName: ''
    , name: 'onread'
    , location: spok.startsWith('onread')
    , propertyPaths:
      [ 'open.resource.context.callback'
      , 'close.resource.context.callback' ]
    , args:
      { '0': null
      , '1':
        { type: 'Buffer'
        , len: spok.gt(1000)
        , included: spok.lt(20)
        , val:
            { utf8: spok.string
            , hex: '636f6e73742074657374203d207265717569' } }
      , proto: 'Object' }
  })
  t.end()
})
