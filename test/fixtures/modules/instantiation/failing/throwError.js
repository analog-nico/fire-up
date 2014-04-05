'use strict';

// Fire me up!

module.exports = function () {
  throw new Error(require('path').relative(process.cwd(), __filename));
};

module.exports.__module = {
  implements: 'instantiation/failing/throwError'
};
