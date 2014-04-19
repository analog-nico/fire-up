'use strict';

// Fire me up!

module.exports = function (options) {
  return options;
};

module.exports.__module = {
  implements: 'injection/fireUp/options',
  inject: 'fireUp/options'
};
