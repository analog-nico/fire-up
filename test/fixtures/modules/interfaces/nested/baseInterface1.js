'use strict';

// Fire me up!

module.exports = {
  implements: ['interfaces/nested/baseInterface1']
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
