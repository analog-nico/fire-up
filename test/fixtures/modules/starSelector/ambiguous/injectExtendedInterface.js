'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/ambiguous/injectExtendedInterface',
  inject: 'starSelector/ambiguous/baseInterface:*',
  type: 'multiple instances'
};

module.exports.factory = function (modules) {
  return modules;
};
