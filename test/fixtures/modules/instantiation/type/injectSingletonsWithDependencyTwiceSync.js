'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/type/injectSingletonsWithDependencyTwiceSync',
  inject: [
    'instantiation/type/injectSingletonsWitDependency',
    'instantiation/type/injectSingletonsWitDependency'
  ],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (set1, set2) {
  return [set1, set2];
};
