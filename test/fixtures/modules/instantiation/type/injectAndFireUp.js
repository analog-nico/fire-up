'use strict';

// Fire me up!

var BPromise = require('bluebird');

module.exports = {
  implements: 'instantiation/type/injectAndFireUp',
  inject: [
    'instantiation/type/singleton/interface1',
    'instantiation/type/multiInstances/interface1',
    'fireUp/currentInjector'
  ],
  type: require('../../../../../lib/index.js').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (singleton1, multi1, fireUp) {
  return BPromise.all([fireUp('instantiation/type/singleton/interface1'), fireUp('instantiation/type/multiInstances/interface1')])
      .then(function (results) {
        return [singleton1, results[0], multi1, results[1]];
      });
};
