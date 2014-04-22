'use strict';

// Fire me up!

module.exports = function (injectBaseInterface1Wrapper) {
  return injectBaseInterface1Wrapper;
};

module.exports.__module = {
  implements: 'injection/use/injectInjectBaseInterface1Wrapper',
  inject: 'injection/use/injectBaseInterface1:wrapper',
  type: 'multiple instances'
};
