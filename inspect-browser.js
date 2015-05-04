'use strict';

var util = require('util');
var spok = require('./');

// terminal colors won't show properly in the browser
spok.color = false;

module.exports = function inspect(obj, color) {
  return util.inspect(obj, false, 5, color);
}
