'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/requireNonexistingModule',
  inject: 'require(notinstalled)'
};

module.exports.factory = function (module) {
  return module;
};
