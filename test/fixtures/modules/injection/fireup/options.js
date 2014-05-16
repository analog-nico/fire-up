'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/fireUp/options',
  inject: 'fireUp/options',
  type: 'multiple instances'
};

module.exports.factory = function (options) {
  return options;
};
