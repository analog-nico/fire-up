'use strict';

// Fire me up!

module.exports = function (baseInterface1) {
  return baseInterface1;
};

module.exports.__module = {
  implements: ['injection/use/injectBaseInterface1Wrapper2', 'interfaces/nested/baseInterface1:inject'],
  inject: 'interfaces/nested/baseInterface1'
};
