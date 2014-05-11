'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/basic/injectWithStarSelector',
  inject: 'starSelector/basic:*',
  type: 'multiple instances'
};

module.exports.factory = function (modules) {
  return modules;
};
