'use strict';

// Fire me up!

var counter = 0;

module.exports = {
  implements: ['instantiation/type/singleton/interface1', 'instantiation/type/singleton/interface2'],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_SINGLETON
};

module.exports.factory = function () {
  counter += 1;
  return [require('path').relative(process.cwd(), __filename), counter];
};
