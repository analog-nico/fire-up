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

    var err;

    if (_.isString(options.basePath) === false || options.basePath.length === 0) {
      err = new fireUp.errors.ConfigError('Please pass an absolute path for options.basePath to function newInjector(...).');
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, 'Paths passed through options.modules are resolved relative to options.basePath. You may e.g. pass __dirname for options.basePath.');
      throw err;
    }

    if (fs.existsSync(options.basePath) === false) {
      err = new fireUp.errors.ConfigError('Please pass a valid absolute path for options.basePath to function newInjector(...). You passed: %s', options.basePath);
      fireUp.log.error({ err: err }, err.message);
      throw err;
    }

  }

  function validateModulesOption(options) {

    var err;

    if (_.isArray(options.modules) === false || options.modules.length === 0) {
      err = new fireUp.errors.ConfigError('Please pass an array of folder / file paths for options.modules parameter to function newInjector(...).');
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "You may use 'some/dir/**/*.js' to include and '!some/dir/further/down/**/*.js' to exclude all JS files in a directory.");
      throw err;
    }

    for ( var i = 0; i < options.modules.length; i+=1 ) {
      if (_.isString(options.modules[i]) === false || options.modules[i].length === 0) {
        err = new fireUp.errors.ConfigError('Please pass a string for element at index %d of options.modules to newInjector(...).', i);
        fireUp.log.error({ err: err }, err.message);
        throw err;
      }
    }

  }

  function validateUseOptions(options, functionName) {

    var err;

    if (_.isUndefined(options.use)) {
      return;
    }

    if (_.isArray(options.use) === false) {
      err = new fireUp.errors.ConfigError('Please pass an array of module names for the options.use parameter to %s.', functionName);
      fireUp.log.error({ err: err }, err.message);
      throw err;
    }

    for ( var i = 0; i < options.use.length; i+=1 ) {

      if (_.isString(options.use[i]) === false || options.use[i].length === 0) {
        err = new fireUp.errors.ConfigError('Please pass a string for the element at index %d of options.use to %s.', i, functionName);
        fireUp.log.error({ err: err }, err.message);
        throw err;
      }

      if (descriptor.validateInterfaceName(options.use[i]) === false) {
        err = new fireUp.errors.ConfigError('Please pass a valid interface name for the element at index %d of options.use to %s.', i, functionName);
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({}, 'A valid interface name must not contain whitespaces nor parenthesises.');
        throw err;
      }

      var parsedInterfaceName = descriptor.parseInterfaceName(options.use[i]);
      if (parsedInterfaceName.length === 1) {
        err = new fireUp.errors.ConfigError('Please pass an interface name referencing a sub interface for the element at index %d of options.use to %s.', i, functionName);
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({}, 'options.use is designed to replace an implementation of an interface with a more specific one. E.g. for unit testing \'%s:mock\' would make sense.', parsedInterfaceName[0]);
        throw err;
      }

    }

  }

  function processOptions(options) {

    validateBasePath(options);
    validateModulesOption(options);
    validateUseOptions(options, 'newInjector(...)');

    // Add standard modules
    var stdModulesFolder = path.relative(fireUp._internal.options.basePath, path.join(__dirname,'../std'));
    fireUp._internal.options.modules.push(stdModulesFolder + "/**/*.js");

  }

  function validateModuleImplementsEntry(entry, i, filePathAbsolute) {
    if (_.isString(entry) === false || entry.length === 0 || descriptor.validateInterfaceName(entry) === false) {
      var err = new fireUp.errors.ConfigError("The following module exports an invalid interface name " + (i ? "at index " + i + " of" : "through") + " the __module.implements property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, 'A valid interface name must not contain whitespaces nor parenthesises.');
      throw err;
    }
  }

  function validateModuleInjectEntry(entry, i, filePathAbsolute) {
    if (_.isString(entry) === false || entry.length === 0 || descriptor.validateModuleReference(entry) === false) {
      var err = new fireUp.errors.ConfigError("The following module exports an invalid module reference " + (i ? "at index " + i + " of" : "through") + " the __module.inject property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, 'A valid module reference must not contain whitespaces and use parenthesises only at the end.');
      throw err;
    }
    // TODO: Else check that module does not inject itself
  }

  function validateModule(module, filePathAbsolute) {

    var err, i;

    if (_.isFunction(module) === false) {
      err = new fireUp.errors.ConfigError("The following module did not export a function: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "Please make sure that the module follows the factory pattern.");
      throw err;
    }

    if (_.isUndefined(module.__module)) {
      err = new fireUp.errors.ConfigError("The following module does not export the __module property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "At minimum the following statement is required: module.exports = { implements: '<module interface>' };");
      throw err;
    } else if (_.isPlainObject(module.__module) === false) {
      err = new fireUp.errors.ConfigError("The following module does not export an object for the __module property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "At minimum the following statement is required: module.exports = { implements: '<module interface>' };");
      throw err;
    }

    if (_.isUndefined(module.__module.implements)) {
      err = new fireUp.errors.ConfigError("The following module does not export the __module.implements property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "You may assign a string denoting the interface implemented by the module or an array of strings for multiple interfaces.");
      throw err;
    } else if (_.isString(module.__module.implements) === false && _.isArray(module.__module.implements) === false) {
      err = new fireUp.errors.ConfigError("The following module exports the __module.implements property in the wrong format: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "You may assign a string denoting the interface implemented by the module or an array of strings for multiple interfaces.");
      throw err;
    }

    if (_.isArray(module.__module.implements)) {

      for ( i = 0; i < module.__module.implements.length; i+=1 ) {
        validateModuleImplementsEntry(module.__module.implements[i], i, filePathAbsolute);
      }

      if (_.uniq(module.__module.implements).length < module.__module.implements.length) {
        err = new fireUp.errors.ConfigError("The following module exports duplicated interface names in the __module.implements property: %s", filePathAbsolute);
        fireUp.log.error({ err: err }, err.message);
        throw err;
      }

    } else {
      validateModuleImplementsEntry(module.__module.implements, null, filePathAbsolute);
    }

    if (_.isUndefined(module.__module.inject) === false) {

      if (_.isString(module.__module.inject) === false && _.isArray(module.__module.inject) === false) {
        err = new fireUp.errors.ConfigError("The following module exports the __module.inject property in the wrong format: %s", filePathAbsolute);
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({}, "You should assign an array of strings that reference the interfaces for which an implementation shall be injected.");
        throw err;
      }

      if (_.isArray(module.__module.inject)) {
        for ( i = 0; i < module.__module.inject.length; i+=1 ) {
          validateModuleInjectEntry(module.__module.inject[i], i, filePathAbsolute);
        }
      } else {
        validateModuleInjectEntry(module.__module.inject, null, filePathAbsolute);
      }

    }

    if (_.isUndefined(module.__module.type) === false) {

      if (_.isString(module.__module.type) === false ||
          (module.__module.type !== fireUp.constants.MODULE_TYPE_SINGLETON && module.__module.type !== fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES)) {
        err = new fireUp.errors.ConfigError("The following module exports an invalid module type through the __module.type property: %s", filePathAbsolute);
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({}, "Please use either '%s' (default) or '%s'.", fireUp.constants.MODULE_TYPE_SINGLETON, fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES);
        throw err;
      }

    }

  }

  function registerModules() {

    fireUp._internal.registry = Registry.new(fireUp);

    // Step 1: Find module files
    var files = glob({ cwd: fireUp._internal.options.basePath }, fireUp._internal.options.modules);
    for ( var i = 0; i < files.length; i+=1 ) {

      var filePathAbsolute = path.join(fireUp._internal.options.basePath, files[i]);
      var filePathRelativeToCwd = path.relative(fireUp._internal.registry.basePathForFileRefs, filePathAbsolute);
      fireUp._internal.registry.modules[filePathRelativeToCwd] = Registry.newModuleEntry();

      // Step 2: Check if they shall be used with fireUp
      var contents = fs.readFileSync(filePathAbsolute, 'utf8');
      if (contents.match(/^\s*\/\/\s*Fire\s*me\s*up\s*!\s*$/im) !== null) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_TO_LOAD;
      } else {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_TO_IGNORE;
        continue;
      }

      // Step 3: Load the module
      var module;
      try {

        module = require(filePathAbsolute);

      } catch (e) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_LOAD_FAILED;
        var requireErr = new fireUp.errors.ModuleLoadingError(filePathAbsolute, e);
        fireUp.log.error({ err: requireErr }, requireErr.message);
        throw requireErr;
      }

      try {

        validateModule(module, filePathAbsolute);

      } catch (e) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_LOAD_FAILED;
        throw e;
      }

      fireUp._internal.registry.modules[filePathRelativeToCwd].cache.module = module;
      if (_.isString(module.__module.inject)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].inject = [module.__module.inject];
      } else if (_.isArray(module.__module.inject)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].inject = module.__module.inject;
      }
      if (_.isString(module.__module.type)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].type = module.__module.type;
      }
      module.__module.__filename = filePathAbsolute;
      module.__module.__dirname = path.dirname(filePathAbsolute);
      fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_LOADED;

      // Step 4: Register the module
      var interfaces = module.__module.implements;
      if (_.isString(interfaces)) {
        interfaces = [interfaces];
      }
      for ( var k = 0; k < interfaces.length; k+=1 ) {

        fireUp._internal.registry.registerInterface(filePathRelativeToCwd, interfaces[k]);

      }
      fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_REGISTERED;

    }

    // Step 5: Validate that all interfaces all available for the required injections
    fireUp.log.info({}, 'Start validating all inject references...');

    _.forOwn(fireUp._internal.registry.modules, function(registryEntry, modulePath) {

      if (registryEntry.status !== fireUp.constants.FILE_STATUS_REGISTERED) {
        return;
      }

      for ( var r = 0; r < registryEntry.inject.length; r+=1 ) {

        var internalDependencies = ['fireUp/currentInjector', 'fireUp/injectionRequest', 'fireUp/options'];
        if (_.contains(internalDependencies, registryEntry.inject[r])) {
          continue;
        }

        fireUp._internal.registry.findInterface(registryEntry.inject[r]); // Logs warnings...

      }

    });

    fireUp.log.info({}, 'Validating all inject references done.');

  }

  function injectionMovesInCircles(injectionRequest) {

    if (injectionRequest._internal.moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {

      var tempInjectionRequest = injectionRequest.parent;
      while (_.isUndefined(tempInjectionRequest) === false) {
        if (_.isEqual(tempInjectionRequest.parsedModuleReference, injectionRequest.parsedModuleReference)) {
          return true;
        }
        tempInjectionRequest = tempInjectionRequest.parent;
      }

      return false;

    } else {
      // TODO: Algorithm for modules of multiple instances type needed.
      return false;
    }

  }

  function loadModule(moduleReference, options, parentInjectionRequest) {

    var err;

    var injectionRequest = {
      moduleReference: moduleReference,
      parsedModuleReference: descriptor.parseModuleReference(moduleReference),
      cachedModule: undefined,
      _internal: {
        interfaceRecord: undefined,
        moduleRecord: undefined
      },
      parent: parentInjectionRequest
    };

    // TODO: Apply use option
    // if parent moduleRecord implements sub interface of moduleReference -> request unchanged
    // else find use entry that is a subinterface of moduleReference; reject if ambiguous

    var interfaceRecord = fireUp._internal.registry.findInterface(moduleReference);
    injectionRequest._internal.interfaceRecord = interfaceRecord;

    if (_.isUndefined(interfaceRecord)) {
      err = new fireUp.errors.NoImplementationError(injectionRequest);
      fireUp.log.error({ err: err }, err.message);
      if (_.isUndefined(injectionRequest.parent)) {
        if (moduleReference.match(/^fireUp\//m)) {
          fireUp.log.debug({}, 'The implementation was directly requested by a fireUp call. However, an interface like \'fireUp/...\' is only available through injection.');
        } else {
          fireUp.log.debug({}, 'The implementation was directly requested by a fireUp call.');
        }
      } else {
        fireUp.log.debug({}, 'The implementation was requested to be injected into the module with the source file at \'%s\'.', injectionRequest.parent._internal.interfaceRecord.file);
      }
      return Promise.reject(err);
    }

    var moduleRecord = fireUp._internal.registry.modules[interfaceRecord.file];
    injectionRequest._internal.moduleRecord = moduleRecord;
    injectionRequest.cachedModule = moduleRecord.cache.module;

    if (moduleRecord.type !== fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES &&
        injectionRequest.parsedModuleReference.args.length > 0) {
      err = new fireUp.errors.ConfigError('The module reference \'%s\' contains static args but the following implementation is not of type \'%s\': %s', moduleReference, fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES, interfaceRecord.file);
      fireUp.log.error({ err: err }, err.message);
      return Promise.reject(err);
    }

    if (injectionMovesInCircles(injectionRequest)) {
      err = new fireUp.errors.CircularDependencyError(injectionRequest);
      fireUp.log.error({ err: err }, err.message);
      return Promise.reject(err);
    }

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

        // TODO: Move upwards to also load fireUp interfaces through loadModule
        if (moduleRecord.inject[i].match(/^fireUp\//m)) {
          if (moduleRecord.inject[i] === 'fireUp/currentInjector') {
            promisesForInjectedModules.push(fireUp);
            continue;
          } else if (moduleRecord.inject[i] === 'fireUp/injectionRequest') {
            promisesForInjectedModules.push(injectionRequest);
            continue;
          } else if (moduleRecord.inject[i] === 'fireUp/options') {
            promisesForInjectedModules.push(options);
            continue;
          } else {
            // FIXME: Could be a mock of those interfaces
            fireUp.log.debug({}, 'The module reference \'%s\' does not match any interface provided by Fire Up!', moduleRecord.inject[i]);
            fireUp.log.debug({}, 'Currently Fire Up! provides: \'fireUp/currentInjector\', \'fireUp/injectionRequest\', and \'fireUp/options\'.');
          }
        }

        promisesForInjectedModules.push(loadModule(moduleRecord.inject[i], options, injectionRequest));

      }

      resolve(Promise.all(promisesForInjectedModules)
          .then(function (modules) {
            return new Promise(function (resolve) {
              for ( var k = 0; k < injectionRequest.parsedModuleReference.args.length; k+=1 ) {
                modules.push(injectionRequest.parsedModuleReference.args[k]);
              }

              resolve(moduleRecord.cache.module.apply(undefined, modules));

            })
            .catch(function (e) {
              var initErr = new fireUp.errors.InstanceInitializationError(injectionRequest, interfaceRecord.file, e);
              fireUp.log.error({ err: initErr }, initErr.message);
              fireUp.log.debug({}, 'All dependencies were initialized and injected. Hence the error occurred in the factory method of \'%s\'.', interfaceRecord.file);
              throw initErr;
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
    validateUseOptions: validateUseOptions,
    loadModule: loadModule
  };

}


module.exports = {
  newLoader: newLoader
};
