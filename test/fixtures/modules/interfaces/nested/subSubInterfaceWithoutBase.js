'use strict';

// Fire me up!

module.exports = {
  implements: ['interfaces/nested/noBaseInterface2:subInterface:subInterface']
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
