'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/fireUp/currentInjector',
  inject: 'fireUp/currentInjector'
};

module.exports.factory = function (currentInjector) {
  return currentInjector;
};
