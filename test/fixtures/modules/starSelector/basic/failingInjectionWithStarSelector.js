'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/basic/failingInjectionWithStarSelector',
  inject: 'starSelector/unknown:*',
  type: 'multiple instances'
};

module.exports.factory = function (modules) {
  return modules;
};
