'use strict';

// Fire me up!

var counter = 0;

module.exports = {
  implements: ['instantiation/type/multiInstances/interface1', 'instantiation/type/multiInstances/interface2'],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function () {
  counter += 1;
  return [require('path').relative(process.cwd(), __filename), counter];
};
