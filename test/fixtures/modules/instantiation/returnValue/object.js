'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/returnValue/object',
  type: 'multiple instances'
};

module.exports.factory = function () {
  return { path: require('path').relative(process.cwd(), __filename) };
};
