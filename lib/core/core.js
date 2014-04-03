'use strict';

var _ = require('lodash');

var loader = require('./loader.js');


function createNewInjector(options, fireUpLib) {

  var fireUp = function (moduleName) {
    return _loader.loadModule(moduleName);
  };

  fireUp.constants = fireUpLib.constants;
  fireUp.errors = fireUpLib.errors;

  fireUp._internal = {};

  var _loader = loader.newLoader(fireUp);
  _loader.processOptions(options);

  fireUp._internal.logLevel = fireUp.constants.LOG_LEVEL_DEBUG;
  if (options.logLevel && _.isNumber(options.logLevel)) {
    fireUp._internal.logLevel = options.logLevel;
  }

  _loader.registerModules();

  return fireUp;
}


module.exports = {
  createNewInjector: createNewInjector
};
