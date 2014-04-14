'use strict';

// Fire me up!

var Promise = require('bluebird');

var counter = 0;

module.exports = function () {
  counter += 1;
  return Promise.resolve()
      .then(function () {
        return [require('path').relative(process.cwd(), __filename), counter];
      });
};

module.exports.__module = {
  implements: ['instantiation/type/singletonAsync/interface1', 'instantiation/type/singletonAsync/interface2'],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_SINGLETON
};
