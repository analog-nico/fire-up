'use strict';

// Fire me up!

module.exports = function (singleton1, singleton2, singleton3, multi1, multi2, multi3) {
  return [singleton1, singleton2, singleton3, multi1, multi2, multi3];
};

module.exports.__module = {
  implements: 'instantiation/type/injectAllTypesAsync',
  inject: [
    'instantiation/type/singletonAsync/interface1',
    'instantiation/type/singletonAsync/interface1',
    'instantiation/type/singletonAsync/interface2',
    'instantiation/type/multiInstancesAsync/interface1',
    'instantiation/type/multiInstancesAsync/interface1',
    'instantiation/type/multiInstancesAsync/interface2'
  ],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
