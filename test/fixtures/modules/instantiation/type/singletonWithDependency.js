'use strict';

// Fire me up!

var counter = 0;

module.exports = {
  implements: ['instantiation/type/singletonWithDependency/interface1', 'instantiation/type/singletonWithDependency/interface2'],
  inject: 'require(path)',
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_SINGLETON
};

module.exports.factory = function (path) {
  counter += 1;
  return [path.relative(process.cwd(), __filename), counter];
};
