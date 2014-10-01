'use strict';

// Fire me up!

var fireUpLib = require('../index.js');
var descriptor = require('../core/descriptor.js');
var _ = require('lodash');

module.exports = {
  implements: 'require:mock',
  inject: ['fireUp/currentInjector', 'fireUp/injectionRequest', 'fireUp/options'],
  type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (fireUp, injectionRequest, options, id) {

  if (_.isUndefined(injectionRequest.parent)) {
    throw new fireUp.errors.ConfigError("Calling fireUp('require(...)') is not supported. 'require(...)' is only available through injection.");
  }

  if (_.isUndefined(id) || _.isString(id) === false || id.length === 0) {
    throw new fireUp.errors.ConfigError("Please provide a valid module id as a static argument. E.g.: 'require(util)'");
  }

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

  if (_.isString(options.requireMockMapping[id]) === false) {
    throw new fireUp.errors.ConfigError("The id '%s' in the requireMockMapping is not a string. Please provide a modules reference as a string.", id);
  }

  if (descriptor.validateModuleReference(options.requireMockMapping[id]) === false) {
    throw new fireUp.errors.ConfigError("The id '%s' in the requireMockMapping maps to an invalid module reference: %s", id, options.requireMockMapping[id]);
  }

  fireUp.log.info({}, indenting + "The injection for 'require(%s)' is mocked by '%s'.", id, options.requireMockMapping[id]);
  return fireUp(options.requireMockMapping[id]);

};
