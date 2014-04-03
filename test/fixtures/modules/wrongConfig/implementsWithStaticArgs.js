'use strict';

// Fire me up!

module.exports = function () {
  return 'wrongConfig/implementsWithStaticArgs.js';
};

module.exports.__module = {
  implements: ['wrongConfig/implementsWithStaticArgs(not allowed)']
};
