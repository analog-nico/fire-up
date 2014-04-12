'use strict';

// Fire me up!

var fireUpLib = require('../index.js');
var path = require('path');
var _ = require('lodash');

module.exports = function (injectionRequest, id) {

  if (_.isUndefined(injectionRequest.parent)) {
    throw new TypeError('Calling fireUp(\'require(...)\') is not supported. \'require(...)\' is only available through injection.');
  }

  if (_.isUndefined(id) || _.isString(id) === false || id.length === 0) {
    throw new TypeError('Please provide a valid module id as a static argument.');
  }

  // Make a relative path absolute
  if (id.match(/^(\.\/|\.\.\/).*/m)) {
    id = path.join(injectionRequest.parent.cachedModule.__module.__dirname, id);
  }

  // TODO: User shall be able to provide a different require function through the options.
  return require.main.require(id);

};

module.exports.__module = {
  implements: 'require',
  inject: ['fireUp/injectionRequest'],
  type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
