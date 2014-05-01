'use strict';

// Fire me up!

var Promise = require('bluebird');

var counter = 0;

module.exports = {
  implements: ['instantiation/type/multiInstancesAsync/interface1', 'instantiation/type/multiInstancesAsync/interface2'],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function () {
  return Promise.resolve()
      .then(function () {
        counter += 1;
        return [require('path').relative(process.cwd(), __filename), counter];
      });
};
