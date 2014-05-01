'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/staticargs/takesStaticArgs',
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (arg1, arg2, arg3, arg4) {
  return [arg1, arg2, arg3, arg4];
};
