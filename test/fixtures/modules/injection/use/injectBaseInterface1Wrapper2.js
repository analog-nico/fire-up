'use strict';

// Fire me up!

module.exports = {
  implements: ['injection/use/injectBaseInterface1Wrapper2', 'interfaces/nested/baseInterface1:inject'],
  inject: 'interfaces/nested/baseInterface1'
};

module.exports.factory = function (baseInterface1) {
  return baseInterface1;
};
