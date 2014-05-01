'use strict';

// Fire me up!

var Promise = require('bluebird');

var counter = 0;

module.exports = {
  implements: ['instantiation/type/singletonAsync/interface1', 'instantiation/type/singletonAsync/interface2'],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_SINGLETON
};

module.exports.factory = function () {
  counter += 1;
  return Promise.resolve()
      .then(function () {
        return [require('path').relative(process.cwd(), __filename), counter];
      });
};
