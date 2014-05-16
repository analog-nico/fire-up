'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/useFireUpInFactory/simple',
  inject: 'fireUp/currentInjector',
  type: 'multiple instances'
};

module.exports.factory = function (fireUp) {
  return fireUp('simple');
};
