'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/noStringAsStaticArg',
  inject: 'require(42)'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
