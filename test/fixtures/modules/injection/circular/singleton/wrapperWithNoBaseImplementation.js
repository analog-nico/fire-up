'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/circular/singleton/wrapperWithNoBaseImplementation:sub',
  inject: 'injection/circular/singleton/wrapperWithNoBaseImplementation'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
