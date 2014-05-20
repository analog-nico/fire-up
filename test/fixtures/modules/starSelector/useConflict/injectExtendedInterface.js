'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/useConflict/injectExtendedInterface',
  inject: 'starSelector/useConflict/baseInterface:*'
};

module.exports.factory = function (modules) {
  return modules;
};
