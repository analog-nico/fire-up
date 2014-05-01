'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/emptyStringAsStaticArg',
  inject: 'require("")'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
