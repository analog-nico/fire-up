'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/requireStandardNodeModule',
  inject: 'require(path)'
};

module.exports.factory = function (path) {
  return path.relative(process.cwd(), __filename);
};
