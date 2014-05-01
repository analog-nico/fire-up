'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/type/injectAllTypesMixed',
  inject: [
    'instantiation/type/singletonAsync/interface1',
    'instantiation/type/singleton/interface1',
    'instantiation/type/singletonAsync/interface2',
    'instantiation/type/multiInstancesAsync/interface1',
    'instantiation/type/multiInstances/interface1',
    'instantiation/type/multiInstancesAsync/interface2'
  ],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (singleton1, singleton2, singleton3, multi1, multi2, multi3) {
  return [singleton1, singleton2, singleton3, multi1, multi2, multi3];
};
