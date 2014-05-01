'use strict';

// Fire me up!

var Promise = require('bluebird');

module.exports = {
  implements: 'instantiation/failing/throwErrorAsync'
};

module.exports.factory = function () {
  return Promise.reject(new Error(require('path').relative(process.cwd(), __filename)));
};
