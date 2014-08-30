'use strict';

// Fire me up!

var BPromise = require('bluebird');

var counter = 0;

module.exports = {
  implements: ['instantiation/type/singletonAsync/interface1', 'instantiation/type/singletonAsync/interface2'],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_SINGLETON
};

module.exports.factory = function () {
  counter += 1;
  return BPromise.resolve()
      .then(function () {
        return [require('path').relative(process.cwd(), __filename), counter];
      });
};
