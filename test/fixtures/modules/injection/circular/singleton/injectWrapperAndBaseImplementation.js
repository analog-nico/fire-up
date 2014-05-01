'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/circular/singleton/injectWrapperAndBaseImplementation',
  inject: [
    'injection/circular/singleton/wrapperWithNoBaseImplementation',
    'injection/circular/singleton/wrapperWithNoBaseImplementation:sub'
  ]
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
