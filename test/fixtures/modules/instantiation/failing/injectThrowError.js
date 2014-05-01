'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/failing/injectThrowError',
  inject: 'instantiation/failing/throwError'
};

module.exports.factory = function(throwError) {
  return require('path').relative(process.cwd(), __filename);
};
