'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/use/injectBaseInterface1',
  inject: 'interfaces/nested/baseInterface1'
};

module.exports.factory = function (baseInterface1) {
  return baseInterface1;
};
