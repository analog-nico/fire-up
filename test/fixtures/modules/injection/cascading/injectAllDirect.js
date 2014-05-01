'use strict';

// Fire me up!

module.exports = {
  implements: ['injection/cascading/injectAllDirect'],
  inject: [
    'injection/direct/noDependencies',
    'injection/direct/singleDependencyAsString',
    'injection/direct/singleDependencyAsList',
    'injection/direct/injectBaseInterfaces',
    'injection/direct/injectSubInterfaces',
    'injection/direct/takesStaticArgs(43)'
  ],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (noDependencies, singleDependencyAsString, singleDependencyAsList, injectBaseInterfaces, injectSubInterfaces, takesStaticArgs) {
  return [noDependencies, singleDependencyAsString, singleDependencyAsList, injectBaseInterfaces, injectSubInterfaces, takesStaticArgs];
};
