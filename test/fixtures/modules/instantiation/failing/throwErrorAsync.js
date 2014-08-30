'use strict';

// Fire me up!

var BPromise = require('bluebird');

module.exports = {
  implements: 'instantiation/failing/throwErrorAsync'
};

module.exports.factory = function () {
  return BPromise.reject(new Error(require('path').relative(process.cwd(), __filename)));
};
