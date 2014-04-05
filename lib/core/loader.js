'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var glob = require("simple-glob");
var path = require('path');

var Registry = require('./registry.js');
var descriptor = require('./descriptor.js');


function newLoader(fireUp) {

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

    fireUp._internal.options = {};
    fireUp._internal.options.basePath = options.basePath;
    fireUp._internal.options.modules = options.modules;
    fireUp._internal.options.use = options.use || [];

  }

  function validateModule(module, filePathAbsolute) {

    var i;

    if (_.isFunction(module) === false) {
      fireUp.log.error("The following module did not export a function: " + filePathAbsolute);
      fireUp.log.debug("Please make sure that the module follows the factory pattern.");
      return false;
    }

    if (_.isPlainObject(module.__module) === false) {
      fireUp.log.error("The following module does not export the __module property: " + filePathAbsolute);
      return false;
    }

    if (_.isString(module.__module.implements) === false && _.isArray(module.__module.implements) === false) {
      fireUp.log.error("The following module does not export the __module.implements property: " + filePathAbsolute);
      return false;
    }

    if (_.isArray(module.__module.implements)) {
      for ( i = 0; i < module.__module.implements.length; i+=1 ) {
        if (_.isString(module.__module.implements[i]) === false ||
            module.__module.implements[i].length === 0 ||
            descriptor.validateInterfaceName(module.__module.implements[i]) === false) {
          fireUp.log.error("The following module exports an invalid module name at index " + i + " of the __module.implements property: " + filePathAbsolute);
          return false;
        }
      }
    } else if (_.isString(module.__module.implements) &&
        (module.__module.implements.length === 0 || descriptor.validateInterfaceName(module.__module.implements) === false)) {
      fireUp.log.error("The following module exports an empty module name through the __module.implements property: " + filePathAbsolute);
      return false;
    }

    if (_.isObject(module.__module.inject)) {

      if (_.isString(module.__module.inject) === false && _.isArray(module.__module.inject) === false) {
        fireUp.log.error("The following module does not export the __module.inject property: " + filePathAbsolute);
        return false;
      }

      if (_.isArray(module.__module.inject)) {
        for ( i = 0; i < module.__module.inject.length; i+=1 ) {
          if (_.isString(module.__module.inject[i]) === false ||
              module.__module.inject[i].length === 0 ||
              descriptor.validateModuleReference(module.__module.inject[i]) === false) {
            fireUp.log.error("The following module exports an invalid module name at index " + i + " of the __module.inject property: " + filePathAbsolute);
            return false;
          }
        }
      } else if (_.isString(module.__module.inject) &&
          (module.__module.inject.length === 0 || descriptor.validateModuleReference(module.__module.inject) === false)) {
        fireUp.log.error("The following module exports an empty module name through the __module.inject property: " + filePathAbsolute);
        return false;
      }

    }

    if (_.isUndefined(module.__module.type) === false) {

      if (_.isString(module.__module.type) === false ||
          (module.__module.type !== fireUp.constants.MODULE_TYPE_SINGLETON && module.__module.type !== fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES)) {
        fireUp.log.error("The following module exports an invalid module type through the __module.type property: " + filePathAbsolute);
        fireUp.log.debug("Please use either '" + fireUp.constants.MODULE_TYPE_SINGLETON + "' (default) or '" + fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES + "'.");
        return false;
      }

    }

    return true;

  }

  function registerModules() {

    fireUp._internal.registry = Registry.new(fireUp);

    // Step 1: Find module files
    var files = glob({ cwd: fireUp._internal.options.basePath }, fireUp._internal.options.modules);
    for ( var i = 0; i < files.length; i+=1 ) {

      var filePathAbsolute = path.join(fireUp._internal.options.basePath, files[i]);
      var filePathRelativeToCwd = path.relative(fireUp._internal.registry.basePathForFileRefs, filePathAbsolute);
      fireUp._internal.registry.modules[filePathRelativeToCwd] = {};
      fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_UNCHECKED;

      // Step 2: Check if they shall be used with fireUp
      var contents = fs.readFileSync(filePathAbsolute, 'utf8');
      if (contents.match(/^\s*\/\/\s*Fire\s*me\s*up\s*!\s*$/im) !== null) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_TO_LOAD;
      } else {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_TO_IGNORE;
        continue;
      }

      // Step 3: Load the module
      var module = require(filePathAbsolute);
      if (validateModule(module, filePathAbsolute) === false) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_INVALID;
        continue;
      }
      fireUp._internal.registry.modules[filePathRelativeToCwd].cache = {
        module: module,
        instantiationPromise: null,
        singletonInstance: null
      };
      if (_.isUndefined(module.__module.inject)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].inject = [];
      } else if (_.isString(module.__module.inject)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].inject = [module.__module.inject];
      } else {
        fireUp._internal.registry.modules[filePathRelativeToCwd].inject = module.__module.inject;
      }
      if (_.isUndefined(module.__module.type)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].type = fireUp.constants.MODULE_TYPE_SINGLETON;
      } else {
        fireUp._internal.registry.modules[filePathRelativeToCwd].type = module.__module.type;
      }
      fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_LOADED;

      // Step 4: Register the module
      var interfaces = module.__module.implements;
      if (_.isString(interfaces)) {
        interfaces = [interfaces];
      }
      for ( var k = 0; k < interfaces.length; k+=1 ) {

        var interfaceChain = descriptor.parseInterfaceName(interfaces[k]);
        var registryPointer = fireUp._internal.registry.interfaces;
        var currentInterface = "";
        for ( var p = 0; p < interfaceChain.length; p+=1 ) {

          if (p > 0) {
            currentInterface = ":";
          }
          currentInterface += interfaceChain[p];

          // Check for conflicts when arriving at last sub interface
          if (p === interfaceChain.length-1) {
            if (_.isPlainObject(registryPointer[interfaceChain[p]]) &&
                _.isUndefined(registryPointer[interfaceChain[p]].file) === false) {
              if (_.isUndefined(registryPointer[interfaceChain[p]].conflictingFiles)) {
                registryPointer[interfaceChain[p]].conflictingFiles = [registryPointer[interfaceChain[p]].file];
                registryPointer[interfaceChain[p]].file = null;
              }
              registryPointer[interfaceChain[p]].conflictingFiles.push(filePathRelativeToCwd);
              fireUp.log.error("The following files conflict by implement the same '" + currentInterface + "' interface:");
              for ( var m = 0; m < registryPointer[interfaceChain[p]].conflictingFiles.length; m+=1 ) {
                fireUp.log.error(path.join(fireUp._internal.registry.basePathForFileRefs, registryPointer[interfaceChain[p]].conflictingFiles[m]));
              }
              continue;
            }
          }

          if (_.isPlainObject(registryPointer[interfaceChain[p]]) === false) {
            registryPointer[interfaceChain[p]] = {
              interfaces: {}
            };
          }

          if (p === interfaceChain.length-1) {
            registryPointer[interfaceChain[p]].file = filePathRelativeToCwd;
          }

          registryPointer = registryPointer[interfaceChain[p]].interfaces;

        }

      }
      fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_REGISTERED;

    }

    // Step 5: Validate that all interfaces all available for the required injections
    fireUp.log.info('Start resolving all inject references...');

    _.forOwn(fireUp._internal.registry.modules, function(registryEntry, modulePath) {

      if (registryEntry.status !== fireUp.constants.FILE_STATUS_REGISTERED) {
        return;
      }

      for ( var r = 0; r < registryEntry.inject.length; r+=1 ) {

        fireUp._internal.registry.findInterface(registryEntry.inject[r]);

      }

    });

    fireUp.log.info('Resolving all inject references done.');

  }

  function loadModule(moduleReference) {

    var interfaceRecord = fireUp._internal.registry.findInterface(moduleReference);
    if (_.isUndefined(interfaceRecord)) {
      fireUp.log.error('fireUp(\'' + moduleReference + '\') failed because no implementation was found for the interface.');
      // TODO: Create own error class
      return Promise.reject(new Error('No implementation was found for the interface \'' + moduleReference + '\'.'));
    }

    var moduleRecord = fireUp._internal.registry.modules[interfaceRecord.file];
    if (moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {
      if (moduleRecord.cache.singletonInstance !== null) {
        return Promise.resolve(moduleRecord.cache.singletonInstance);
      } else if (moduleRecord.cache.instantiationPromise !== null) {
        return moduleRecord.cache.instantiationPromise;
      }
    }

    var promise = new Promise(function (resolve) {

      var promisesForInjectedModules = [];
      for ( var i = 0; i < moduleRecord.inject.length; i+= 1 ) {
        promisesForInjectedModules.push(fireUp(moduleRecord.inject[i]));
      }

      resolve(Promise.all(promisesForInjectedModules)
          .then(function (modules) {
            return new Promise(function (resolve) {
              resolve((function () {
                try {
                  return moduleRecord.cache.module.apply(undefined, modules);
                } catch (e) {
                  var initErr = new fireUp.errors.InitializationError(moduleReference, interfaceRecord.file, e);
                  fireUp.log.error(initErr);
                  throw initErr;
                }
              })());
            })
            .then(function (instance) {
              if (moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {
                moduleRecord.cache.singletonInstance = instance;
              }
              return instance;
            });
          }));

    }).finally(function () {
      moduleRecord.cache.instantiationPromise = null;
    });

    if (moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {
      moduleRecord.cache.instantiationPromise = promise;
    }

    return promise;

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
