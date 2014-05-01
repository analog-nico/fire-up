'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/failing/throwError'
};

module.exports.factory = function () {
  throw new Error(require('path').relative(process.cwd(), __filename));
};
