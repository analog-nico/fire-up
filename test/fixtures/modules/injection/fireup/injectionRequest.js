'use strict';

// Fire me up!

module.exports = {
  implements: ['injection/fireUp/injectionRequest', 'injection/fireUp/injectionRequest:plain', 'injection/fireUp/injectionRequest/base:plain'],
  inject: 'fireUp/injectionRequest',
  type: 'multiple instances'
};

module.exports.factory = function (injectionRequest) {
  return injectionRequest;
};
