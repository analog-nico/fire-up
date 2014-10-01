'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/requireBluebird',
  inject: 'require(bluebird)'
};

module.exports.factory = function (bluebird) {
  return bluebird;
};
