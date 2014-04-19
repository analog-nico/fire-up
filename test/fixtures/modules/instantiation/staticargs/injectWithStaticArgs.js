'use strict';

// Fire me up!

module.exports = function (takesStaticArgs) {
  return takesStaticArgs;
};

module.exports.__module = {
  implements: 'instantiation/staticargs/injectWithStaticArgs',
  inject: 'instantiation/staticargs/takesStaticArgs(string, true, 0, 0.5)'
};
