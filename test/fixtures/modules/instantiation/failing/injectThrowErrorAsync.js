'use strict';

// Fire me up!

module.exports = function(throwError) {
  return require('path').relative(process.cwd(), __filename);
};

module.exports.__module = {
  implements: 'instantiation/failing/injectThrowErrorAsync',
  inject: 'instantiation/failing/throwErrorAsync'
};
