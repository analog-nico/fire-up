'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');


function newLoader(_fireUp) {

  var fireUp = _fireUp;


  function validateBasePath(options) {

    if (_.isString(options.basePath) === false || options.basePath.length === 0) {
      throw new TypeError('Please pass __dirname or another path for the options.basePath of function newInjector(...).');
    }

    if (fs.existsSync(options.basePath) === false) {
      throw new TypeError('Please pass a valid path for the options.basePath of function newInjector(...). You set: ' + options.basePath);
    }

  }

  function validateIncludeOption(options) {

    if (_.isArray(options.include) === false || options.include.length === 0) {
      throw new TypeError('Please pass an array of folder / file paths for the options.include parameter of function newInjector(...).');
    }

    for ( var i = 0; i < options.include.length; i+=1 ) {
      if (_.isString(options.include[i]) === false || options.include[i].length === 0) {
        throw new TypeError('Please pass a valid string for element ' + (i+1) + ' of options.include when calling newInjector(...).');
      }
    }

  }

  function validateExcludeOption(options) {

    if (_.isUndefined(options.exclude)) {
      return;
    }

    if (_.isArray(options.exclude) === false) {
      throw new TypeError('Please pass an array of folder / file paths for the options.exclude parameter of function newInjector(...).');
    }

    for ( var i = 0; i < options.exclude.length; i+=1 ) {
      if (_.isString(options.exclude[i]) === false || options.exclude[i].length === 0) {
        throw new TypeError('Please pass a valid string for element ' + (i+1) + ' of options.exclude when calling newInjector(...).');
      }
    }

  }

  function validateUseOptions(options) {

    if (_.isUndefined(options.use)) {
      return;
    }

    if (_.isArray(options.use) === false) {
      throw new TypeError('Please pass an array of modules names for the options.use parameter of function newInjector(...).');
    }

    for ( var i = 0; i < options.use.length; i+=1 ) {
      if (_.isString(options.use[i]) === false || options.use[i].length === 0) {
        throw new TypeError('Please pass a valid string for element ' + (i+1) + ' of options.use when calling newInjector(...).');
      }
    }

  }

  function processOptions(options) {

    validateBasePath(options);
    validateIncludeOption(options);
    validateExcludeOption(options);
    validateUseOptions(options);

    fireUp._internal.include = options.include || [];
    fireUp._internal.exclude = options.exclude || [];
    fireUp._internal.use = options.use || [];

  }

  function registerModules() {

    fireUp._internal.registry = {};

  }

  function loadModule(moduleName) {
    return Promise.reject(new Error('Not implemented yet.'));
  }

  return {
    processOptions: processOptions,
    registerModules: registerModules,
    loadModule: loadModule
  };

}


module.exports = {
  newLoader: newLoader
};
