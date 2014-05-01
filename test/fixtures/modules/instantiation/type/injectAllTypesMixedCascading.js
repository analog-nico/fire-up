'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/type/injectAllTypesMixedCascading',
  inject: [
    'instantiation/type/singletonAsync/interface1',
    'instantiation/type/singleton/interface1',
    'instantiation/type/multiInstancesAsync/interface1',
    'instantiation/type/multiInstances/interface1',
    'instantiation/type/injectAllTypesMixed',
    'instantiation/type/injectAllTypes',
    'instantiation/type/injectAllTypesAsync',
    'instantiation/type/singletonAsync/interface1',
    'instantiation/type/singleton/interface1',
    'instantiation/type/multiInstancesAsync/interface1',
    'instantiation/type/multiInstances/interface1'
  ]
};

module.exports.factory = function (singleton1, singleton2, multi1, multi2, mixed, sync, async, singleton3, singleton4, multi3, multi4) {
  return [singleton1, singleton2, multi1, multi2, mixed, sync, async, singleton3, singleton4, multi3, multi4];
};
