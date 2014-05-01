'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/type/injectSingletonsWitDependency',
  inject: [
    'instantiation/type/singletonWithDependency/interface1',
    'instantiation/type/singletonWithDependency/interface1',
    'instantiation/type/singletonWithDependency/interface2'
  ],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (singleton1, singleton2, singleton3) {
  return [singleton1, singleton2, singleton3];
};
