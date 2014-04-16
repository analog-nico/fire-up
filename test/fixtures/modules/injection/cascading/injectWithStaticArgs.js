'use strict';

// Fire me up!

module.exports = function (takesStaticArgs) {
  return takesStaticArgs;
};

module.exports.__module = {
  implements: ['injection/cascading/injectWithStaticArgs'],
  inject: ['injection/direct/takesStaticArgs(43)'],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
