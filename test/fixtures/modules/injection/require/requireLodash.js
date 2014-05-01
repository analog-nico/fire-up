'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/requireLodash',
  inject: 'require(lodash)'
};

module.exports.factory = function (lodash) {
  return lodash;
};
