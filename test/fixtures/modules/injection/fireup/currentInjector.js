'use strict';

// Fire me up!

module.exports = function (currentInjector) {
  return currentInjector;
};

module.exports.__module = {
  implements: 'injection/fireUp/currentInjector',
  inject: 'fireUp/currentInjector'
};
