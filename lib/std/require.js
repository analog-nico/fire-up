'use strict';

// Fire me up!

var fireUpLib = require('../index.js');
var path = require('path');
var _ = require('lodash');

module.exports = function (relativeModulePath, basePath) {

  if (_.isUndefined(relativeModulePath) || _.isString(relativeModulePath) === false || relativeModulePath.length === 0) {
    throw new TypeError('Please provide a valid module path as a static argument.');
  }

  if (_.isUndefined(basePath)) {
    return require(relativeModulePath);
  }

  if (_.isString(basePath) === false || basePath.length === 0) {
    throw new TypeError('Please provide a valid base path as a static argument. Usually \'__dirname\' is used.');
  } else if (basePath === '__dirname') {
    throw new TypeError('Instead of \'require(' + relativeModulePath + ', __dirname)\' use: \'require(' + relativeModulePath + ', \' + __dirname + \')\'');
  }

  var absoluteModulePath = path.join(basePath, relativeModulePath);
  return require(absoluteModulePath);

};

module.exports.__module = {
  implements: 'require',
  type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
