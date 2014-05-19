'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/basic/emptyInjectionWithStarSelector',
  inject: ['starSelector/unknown:*', 'starSelector/basic/injectWithStarSelector:*'],
  type: 'multiple instances'
};

module.exports.factory = function (modules1, modules2) {
  return [modules1, modules2];
};
