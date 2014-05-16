'use strict';

// Fire me up!

module.exports = {
  implements: 'fireUp/currentInjector:newInsteadOfCurrent',
  inject: 'fireUp/options'
};

module.exports.factory = function (options) {
  return require('../../../../../lib/index.js').newInjector(options);
};
