'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/direct/noDependencies'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
