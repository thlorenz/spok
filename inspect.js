'use strict';

var util = require('util');

module.exports = function inspect(obj, color) {
  return util.inspect(obj, false, 5, color);
}
