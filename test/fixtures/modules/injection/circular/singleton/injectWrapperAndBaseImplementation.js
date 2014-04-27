'use strict';

// Fire me up!

module.exports = function () {
  return require('path').relative(process.cwd(), __filename);
};

module.exports.__module = {
  implements: 'injection/circular/singleton/injectWrapperAndBaseImplementation',
  inject: [
    'injection/circular/singleton/wrapperWithNoBaseImplementation',
    'injection/circular/singleton/wrapperWithNoBaseImplementation:sub'
  ]
};
