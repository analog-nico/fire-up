'use strict';

// Fire me up!

module.exports = {
  implements: ['interfaces/nested/noBaseInterface1:subInterface1']
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
