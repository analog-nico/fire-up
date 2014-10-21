'use strict';

// Fire me up!

var fireUpLib = require('../index.js');
var path = require('path');
var _ = require('lodash');

module.exports = {
  implements: 'require',
  inject: ['fireUp/currentInjector', 'fireUp/injectionRequest', 'fireUp/options'],
  type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (fireUp, injectionRequest, options, id) {

  if (_.isUndefined(id) || _.isString(id) === false || id.length === 0) {
    throw new fireUp.errors.ConfigError("Please provide a valid module id as a static argument. E.g.: 'require(util)'");
  }

  // Make a relative path absolute
  // TODO: Consider path /^\.$/ which refers to the local index.js
  if (id.match(/^(\.\/|\.\.\/)/m)) {

    if (_.isUndefined(injectionRequest.parent)) {
      throw new fireUp.errors.ConfigError("Calling fireUp('require(...)') for relative paths is not supported. 'require(...)' with a relative path is only available through injection.");
    }

    id = path.join(injectionRequest.parent.cachedModule.__dirname, id);

  }

  if (_.isFunction(options.require)) {
    return options.require(id);
  } else {
    try {
      return require.main.require(id);
    } catch (e) {
      if (id.charAt(0) !== '/') {
        fireUp.log.debug({}, "The dependency injection wrapper for require uses the main require function which may not always use the search paths you intended.");
        fireUp.log.debug({}, "You may pass your own require function like this: fireUpLib.newInjector({ ..., require: require });");
      }
      throw e;
    }
  }

};
