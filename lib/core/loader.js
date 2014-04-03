'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var glob = require("simple-glob");
var path = require('path');


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

  function validateModulesOption(options) {

    if (_.isArray(options.modules) === false || options.modules.length === 0) {
      throw new TypeError('Please pass an array of folder / file paths for the options.modules parameter of function newInjector(...).');
    }

    for ( var i = 0; i < options.modules.length; i+=1 ) {
      if (_.isString(options.modules[i]) === false || options.modules[i].length === 0) {
        throw new TypeError('Please pass a valid string for element ' + (i+1) + ' of options.modules when calling newInjector(...).');
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
    validateModulesOption(options);
    validateUseOptions(options);

    fireUp._internal.basePath = options.basePath;
    fireUp._internal.modules = options.modules;
    fireUp._internal.use = options.use || [];

  }

  function registerModules() {

    fireUp._internal.registry = {};
    fireUp._internal.registry.files = {};
    fireUp._internal.registry.interfaces = {};

    var files = glob({ cwd: fireUp._internal.basePath }, fireUp._internal.modules);
    for ( var i = 0; i < files.length; i+=1 ) {

      var filePath = path.join(fireUp._internal.basePath, files[i]);
      fireUp._internal.registry.files[filePath] = {
        status: fireUp.constants.FILE_STATUS_UNCHECKED
      };

      var contents = fs.readFileSync(filePath, 'utf8');
      if (contents.match(/^\s*\/\/\s*Fire\s*me\s*up(\s*|\s*!\s*)$/im)) {
        fireUp._internal.registry.files[filePath].status = fireUp.constants.FILE_STATUS_TO_LOAD;
      } else {
        fireUp._internal.registry.files[filePath].status = fireUp.constants.FILE_STATUS_TO_IGNORE;
      }
    }
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
