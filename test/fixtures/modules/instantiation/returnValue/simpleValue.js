'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/returnValue/simpleValue',
  type: 'multiple instances'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
