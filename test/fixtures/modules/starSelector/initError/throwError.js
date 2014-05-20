'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/initError/throwError:sub'
};

module.exports.factory = function () {
  throw new Error(require('path').relative(process.cwd(), __filename));
};
