'use strict';

// Fire me up!

var fireUpLib = require('../index.js');
var path = require('path');
var _ = require('lodash');

module.exports = function (injectionRequest, options, id) {

  if (_.isUndefined(injectionRequest.parent)) {
    throw new fireUpLib.errors.ConfigError("Calling fireUp('require(...)') is not supported. 'require(...)' is only available through injection.");
  }

  if (_.isUndefined(id) || _.isString(id) === false || id.length === 0) {
    throw new fireUpLib.errors.ConfigError("Please provide a valid module id as a static argument. E.g.: 'require(util)'");
  }

  // Make a relative path absolute
  if (id.match(/^(\.\/|\.\.\/).*/m)) {
    id = path.join(injectionRequest.parent.cachedModule.__module.__dirname, id);
  }

  if (_.isFunction(options.require)) {
    return options.require(id);
  } else {
    return require.main.require(id);
  }

};

module.exports.__module = {
  implements: 'require',
  inject: ['fireUp/injectionRequest', 'fireUp/options'],
  type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
