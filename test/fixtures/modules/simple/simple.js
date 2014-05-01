'use strict';

// Fire me up!

module.exports = {
  implements: 'simple'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
