'use strict';

// Fire me up!

module.exports = function (singleton1, singleton2, singleton3) {
  return [singleton1, singleton2, singleton3];
};

module.exports.__module = {
  implements: 'instantiation/type/injectSingletonsWitDependency',
  inject: [
    'instantiation/type/singletonWithDependency/interface1',
    'instantiation/type/singletonWithDependency/interface1',
    'instantiation/type/singletonWithDependency/interface2'
  ],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
