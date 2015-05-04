'use strict';

var util = require('util');

module.exports = function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}
