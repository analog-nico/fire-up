'use strict';

// Fire me up!

module.exports = function (path) {
  return path.relative(process.cwd(), __filename);
};

module.exports.__module = {
  implements: 'injection/require/requireStandardNodeModule',
  inject: 'require(path)'
};
