'use strict';

// Fire me up!

module.exports = function (singleton1, singleton2, singleton3, multi1, multi2, multi3) {
  return [singleton1, singleton2, singleton3, multi1, multi2, multi3];
};

module.exports.__module = {
  implements: 'instantiation/type/injectAllTypes',
  inject: [
    'instantiation/type/singleton/interface1',
    'instantiation/type/singleton/interface1',
    'instantiation/type/singleton/interface2',
    'instantiation/type/multiInstances/interface1',
    'instantiation/type/multiInstances/interface1',
    'instantiation/type/multiInstances/interface2'
  ],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
