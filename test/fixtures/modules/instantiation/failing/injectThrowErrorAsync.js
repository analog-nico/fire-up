'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/failing/injectThrowErrorAsync',
  inject: 'instantiation/failing/throwErrorAsync'
};

module.exports.factory = function(throwError) {
  return require('path').relative(process.cwd(), __filename);
};
