'use strict';

// Fire me up!

module.exports = {
  implements: ['interfaces/nested/baseInterface1:subInterface1:subSubInterface']
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
