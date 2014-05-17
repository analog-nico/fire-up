'use strict';

// Fire me up!

module.exports = {
  implements: ['injection/fireUp/nestedInjectionRequest', 'injection/fireUp/injectionRequest:nested'],
  inject: 'injection/fireUp/injectionRequest',
  type: 'multiple instances'
};

module.exports.factory = function (injectionRequest) {
  return injectionRequest;
};
