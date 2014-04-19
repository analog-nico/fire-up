'use strict';

// Fire me up!

module.exports = function () {
  return require('path').relative(process.cwd(), __filename);
};

module.exports.__module = {
  implements: 'injection/require/noStringAsStaticArg',
  inject: 'require(42)'
};
