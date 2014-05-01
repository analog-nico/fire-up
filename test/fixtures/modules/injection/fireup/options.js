'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/fireUp/options',
  inject: 'fireUp/options'
};

module.exports.factory = function (options) {
  return options;
};
