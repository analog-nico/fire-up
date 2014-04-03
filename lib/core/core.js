'use strict';

var _ = require('lodash');

var loader = require('./loader.js');
var logger = require('./logger.js');


function createNewInjector(options, fireUpLib) {

  var fireUp = function (moduleName) {
    return _loader.loadModule(moduleName);
  };

  fireUp.constants = fireUpLib.constants;
  fireUp.errors = fireUpLib.errors;
  fireUp.log = logger.newLogger(fireUp);

  fireUp._internal = {};

  if (_.isPlainObject(options) === false) {
    throw new TypeError('Please pass an object for the options parameter of function newInjector(...).');
  }

  fireUp._internal.logLevel = fireUp.constants.LOG_LEVEL_DEBUG;
  if (options.logLevel && _.isNumber(options.logLevel)) {
    fireUp._internal.logLevel = options.logLevel;
  }

  var _loader = loader.newLoader(fireUp);
  _loader.processOptions(options);

  _loader.registerModules();

  return fireUp;
}


module.exports = {
  createNewInjector: createNewInjector
};
