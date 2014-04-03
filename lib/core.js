'use strict';

var _ = require('lodash');

var loader = require('./loader.js');


function createNewInjector(options, fireUpLib) {

  if ((_.isUndefined(options) === false && _.isObject(options) === false) || _.isFunction(options) === true) {
    throw new TypeError('Please pass an object for the options parameter.');
  }

  var fireUp = function (moduleName) {
    return _loader.loadModule(moduleName);
  };

  fireUp.constants = fireUpLib.constants;
  fireUp.errors = fireUpLib.errors;

  fireUp._internal = {};

  fireUp._internal.logLevel = fireUp.constants.LOG_LEVEL_DEBUG;
  if (options && options.logLevel) {
    fireUp._internal.logLevel = options.logLevel;
  }

  var _loader = loader.newLoader(fireUp._internal);
  _loader.registerModules(options);

  return fireUp;
}


module.exports = {
  createNewInjector: createNewInjector
};
