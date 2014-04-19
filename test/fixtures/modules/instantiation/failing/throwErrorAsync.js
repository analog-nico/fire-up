'use strict';

// Fire me up!

var Promise = require('bluebird');

module.exports = function () {
  return Promise.reject(new Error(require('path').relative(process.cwd(), __filename)));
};

module.exports.__module = {
  implements: 'instantiation/failing/throwErrorAsync'
};
