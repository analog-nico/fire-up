'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/noStaticArg',
  inject: 'require'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
