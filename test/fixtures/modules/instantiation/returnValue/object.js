'use strict';

// Fire me up!

module.exports = function () {
  return { path: require('path').relative(process.cwd(), __filename) };
};

module.exports.__module = {
  implements: 'instantiation/returnValue/object',
  type: 'multiple instances'
};
