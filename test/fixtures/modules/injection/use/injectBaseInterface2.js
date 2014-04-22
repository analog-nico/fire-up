'use strict';

// Fire me up!

module.exports = function (baseInterface2) {
  return baseInterface2;
};

module.exports.__module = {
  implements: 'injection/use/injectBaseInterface2',
  inject: 'interfaces/nested/baseInterface2'
};
