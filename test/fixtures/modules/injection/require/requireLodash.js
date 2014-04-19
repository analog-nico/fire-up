'use strict';

// Fire me up!

module.exports = function (lodash) {
  return lodash;
};

module.exports.__module = {
  implements: 'injection/require/requireLodash',
  inject: 'require(lodash)'
};
