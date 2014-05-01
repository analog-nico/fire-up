'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/returnValue/function',
  type: 'multiple instances'
};

module.exports.factory = function () {
  return function () {
    return require('path').relative(process.cwd(), __filename);
  };
};
