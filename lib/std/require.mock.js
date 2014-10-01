'use strict';

// Fire me up!

var fireUpLib = require('../index.js');
var _ = require('lodash');

module.exports = {
  implements: 'require:mock',
  inject: ['fireUp/currentInjector', 'fireUp/injectionRequest', 'fireUp/options'],
  type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (fireUp, injectionRequest, options, id) {

  if (_.isUndefined(options.requireMockMapping) || _.isPlainObject(options.requireMockMapping) === false) {
    throw new fireUp.errors.ConfigError("When using 'require:mock' please pass the 'requireMockMapping' object through the options.");
  }

  var indenting = '';
  for ( var i = 0; i < injectionRequest.nestingLevel; i+=1 ) {
    indenting += '    ';
  }

  if (_.isUndefined(options.requireMockMapping[id])) {
    fireUp.log.info({}, indenting + "The id '%s' was not found in the requireMockMapping. Falling back to a regular require injection.", id);
    return (require('./require.js')).factory(fireUp, injectionRequest, options, id);
  }

  fireUp.log.info({}, indenting + "The injection for 'require(%s)' is mocked by '%s'.", id, options.requireMockMapping[id]);
  return fireUp(options.requireMockMapping[id]);

};
