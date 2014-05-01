'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/use/injectBaseInterface2',
  inject: 'interfaces/nested/baseInterface2'
};

module.exports.factory = function (baseInterface2) {
  return baseInterface2;
};
