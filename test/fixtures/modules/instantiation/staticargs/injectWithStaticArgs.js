'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/staticargs/injectWithStaticArgs',
  inject: 'instantiation/staticargs/takesStaticArgs(string, true, 0, 0.5)'
};

module.exports.factory = function (takesStaticArgs) {
  return takesStaticArgs;
};
