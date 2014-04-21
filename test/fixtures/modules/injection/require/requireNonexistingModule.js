'use strict';

// Fire me up!

module.exports = function (module) {
  return module;
};

module.exports.__module = {
  implements: 'injection/require/requireNonexistingModule',
  inject: 'require(notinstalled)'
};
