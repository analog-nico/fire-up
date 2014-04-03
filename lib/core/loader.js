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
        throw new TypeError('Please pass a valid string for element at index ' + i + ' of options.modules when calling newInjector(...).');
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
        throw new TypeError('Please pass a valid string for element at index ' + i + ' of options.use when calling newInjector(...).');
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

  function validateModule(module, filePath) {

    var i;

    if (_.isFunction(module) === false) {
      fireUp.log.error("The following module did not export a function: " + filePath);
      fireUp.log.error("Please make sure that the module follows the factory pattern.");
      return false;
    }

    if (_.isPlainObject(module.__module) === false) {
      fireUp.log.error("The following module does not export the __module property: " + filePath);
      return false;
    }

    if (_.isString(module.__module.implements) === false && _.isArray(module.__module.implements) === false) {
      fireUp.log.error("The following module does not export the __module.implements property: " + filePath);
      return false;
    }

    if (_.isArray(module.__module.implements)) {
      for ( i = 0; i < module.__module.implements.length; i+=1 ) {
        if (_.isString(module.__module.implements[i]) === false || module.__module.implements[i].length === 0) {
          fireUp.log.error("The following module exports an invalid module name at index " + i + " of the __module.implements property: " + filePath);
          return false;
        }
      }
    } else if (_.isString(module.__module.implements) && module.__module.implements.length === 0) {
      fireUp.log.error("The following module exports an empty module name through the __module.implements property: " + filePath);
      return false;
    }

    if (_.isObject(module.__module.inject)) {

      if (_.isString(module.__module.inject) === false && _.isArray(module.__module.inject) === false) {
        fireUp.log.error("The following module does not export the __module.inject property: " + filePath);
        return false;
      }

      if (_.isArray(module.__module.inject)) {
        for ( i = 0; i < module.__module.inject.length; i+=1 ) {
          if (_.isString(module.__module.inject[i]) === false || module.__module.inject[i].length === 0) {
            fireUp.log.error("The following module exports an invalid module name at index " + i + " of the __module.inject property: " + filePath);
            return false;
          }
        }
      } else if (_.isString(module.__module.inject) && module.__module.inject.length === 0) {
        fireUp.log.error("The following module exports an empty module name through the __module.inject property: " + filePath);
        return false;
      }

    }

    // TODO: type

    return true;

  }

  function registerModules() {

    fireUp._internal.registry = {};
    fireUp._internal.registry.modules = {};
    fireUp._internal.registry.interfaces = {};

    // Step 1: Find module files
    var files = glob({ cwd: fireUp._internal.basePath }, fireUp._internal.modules);
    for ( var i = 0; i < files.length; i+=1 ) {

      var filePath = path.join(fireUp._internal.basePath, files[i]);
      fireUp._internal.registry.modules[filePath] = {};
      fireUp._internal.registry.modules[filePath].status = fireUp.constants.FILE_STATUS_UNCHECKED;

      // Step 2: Check if they shall be used with fireUp
      var contents = fs.readFileSync(filePath, 'utf8');
      if (contents.match(/^\s*\/\/\s*Fire\s*me\s*up(\s*|\s*!\s*)$/im)) {
        fireUp._internal.registry.modules[filePath].status = fireUp.constants.FILE_STATUS_TO_LOAD;
      } else {
        fireUp._internal.registry.modules[filePath].status = fireUp.constants.FILE_STATUS_TO_IGNORE;
        continue;
      }

      // Step 3: Load the module
      var module = require(filePath);
      if (validateModule(module, filePath) === false) {
        fireUp._internal.registry.modules[filePath].status = fireUp.constants.FILE_STATUS_INVALID;
        continue;
      }
      fireUp._internal.registry.modules[filePath].cache = { module: module };
      fireUp._internal.registry.modules[filePath].status = fireUp.constants.FILE_STATUS_LOADED;

      // Step 4: Register the module
      var interfaces = module.__module.implements;
      if (_.isString(interfaces)) {
        interfaces = [interfaces];
      }
      for ( var k = 0; k < interfaces.length; k+=1 ) {
        if (_.isPlainObject(fireUp._internal.registry.interfaces[interfaces[k]])) {
          if (_.isUndefined(fireUp._internal.registry.interfaces[interfaces[k]].conflictingFiles)) {
            fireUp._internal.registry.interfaces[interfaces[k]].conflictingFiles = [fireUp._internal.registry.interfaces[interfaces[k]].file];
            fireUp._internal.registry.interfaces[interfaces[k]].file = null;
          }
          fireUp._internal.registry.interfaces[interfaces[k]].conflictingFiles
              .push(fireUp._internal.registry.interfaces[interfaces[k]].file);
          var fileList = "";
          for ( var m = 0; m < fireUp._internal.registry.interfaces[interfaces[k]].conflictingFiles.length; m+=1 ) {
            if (m > 0) {
              fileList += ", ";
            }
            fileList += fireUp._internal.registry.interfaces[interfaces[k]].conflictingFiles[m];
          }
          fireUp.log.error("The following files conflict by implement the same '" + interfaces[k] + "' interface: " + fileList);
          continue;
        }
        fireUp._internal.registry.interfaces[interfaces[k]] = {};
        fireUp._internal.registry.interfaces[interfaces[k]].file = filePath;
      }
      fireUp._internal.registry.modules[filePath].status = fireUp.constants.FILE_STATUS_REGISTERED;

    }

    // Step 5: Validate that all interfaces all available for the required injections
    // fireUp.log.warning(...);
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
