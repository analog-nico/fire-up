'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/use/injectInjectBaseInterface1Wrapper',
  inject: 'injection/use/injectBaseInterface1:wrapper',
  type: 'multiple instances'
};

module.exports.factory = function (injectBaseInterface1Wrapper) {
  return injectBaseInterface1Wrapper;
};
