'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var glob = require("simple-glob");
var path = require('path');

var Registry = require('./registry.js');
var descriptor = require('./descriptor.js');


function newLoader(fireUp) {

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
      if (_.isString(module.__module.implements)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].implements = [module.__module.implements];
      } else {
        fireUp._internal.registry.modules[filePathRelativeToCwd].implements = module.__module.implements;
      }
      if (_.isUndefined(module.__module.inject) === false) {
        if (_.isString(module.__module.inject)) {
          fireUp._internal.registry.modules[filePathRelativeToCwd].inject = [module.__module.inject];
        } else {
          fireUp._internal.registry.modules[filePathRelativeToCwd].inject = module.__module.inject;
        }
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

        fireUp._internal.registry.findInterface(
            descriptor.convertModuleReferenceToInterfaceName(registryEntry.inject[r])
        ); // Logs warnings...

      }

    });

    fireUp.log.info({}, 'Validating all inject references done.');

  }

  function injectionMovesInCircles(injectionRequest) {

    // FIXME: Circles can occur if module requests the injection of a parent interface of one of its own implementing interfaces.
    // Then no implementation may exist for the parent interface but the module itself is the next unambiguous implementation of that parent interface.

    if (injectionRequest._internal.moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {

      var tempInjectionRequest = injectionRequest.parent;
      while (_.isUndefined(tempInjectionRequest) === false) {
        // TODO: Although the used interface may be different fireUp may load the same implementation.
        // 1. A module implementing two interfaces is loaded both.
        // 2. A same (sub) sub interface is loaded for the both interfaces.
        if (tempInjectionRequest.usedInterface === injectionRequest.usedInterface) {
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

  function applyUseOption(options, injectionRequest) {

    var requestedInterface = descriptor.convertModuleReferenceToInterfaceName(injectionRequest.moduleReference);
    var searchStringForSubInterfaces = requestedInterface + ':';

    if (_.isUndefined(injectionRequest.parent) === false) {

      for ( var i = 0; i < injectionRequest.parent._internal.moduleRecord.implements.length; i+=1 ) {

        if (injectionRequest.parent._internal.moduleRecord.implements[i].substr(0, searchStringForSubInterfaces.length) === searchStringForSubInterfaces) {
          // Requesting module implements a sub interface of the requested one. E.g. the module is a wrapper.
          // Use options do not apply.
          injectionRequest.usedInterface = requestedInterface;
          return;
        }

      }

    }

    var subInterfaces = _.filter(options.use, function (entry) {
      return entry.substr(0, searchStringForSubInterfaces.length) === searchStringForSubInterfaces;
    });

    if (subInterfaces.length === 0) {
      injectionRequest.usedInterface = requestedInterface;
      return;
    } else if (subInterfaces.length === 1) {
      injectionRequest.usedInterface = subInterfaces[0];
      return;
    }

    var parsedSubInterfaces = _.map(subInterfaces, descriptor.parseInterfaceName);
    var maxNesting = _.max(parsedSubInterfaces, 'length');
    var subInterfacesWithDeepestNesting = _.filter(parsedSubInterfaces, function (entry) {
      return entry.length === maxNesting;
    });

    if (subInterfacesWithDeepestNesting.length === 1) {

      var allInterfacesAreCompatible = true;

      for ( var k = 0; k < parsedSubInterfaces.length; k+=1 ) {
        if (_.isEqual(parsedSubInterfaces[k], _.first(subInterfacesWithDeepestNesting[0], parsedSubInterfaces[k].length)) === false) {
          allInterfacesAreCompatible = false;
          break;
        }
      }

      if (allInterfacesAreCompatible === true) {
        injectionRequest.usedInterface = descriptor.formatInterfaceName(subInterfacesWithDeepestNesting[0]);
        return;
      }

    }

    var err = new fireUp.errors.UseOptionConflictError(requestedInterface, subInterfaces, injectionRequest);
    fireUp.log.error({ err: err }, err.message);
    throw err;

  }

  function loadModule(moduleReference, options, parentInjectionRequest) {

    var err;

    var injectionRequest = {
      moduleReference: moduleReference,
      parsedModuleReference: descriptor.parseModuleReference(moduleReference),
      usedInterface: undefined,
      cachedModule: undefined,
      _internal: {
        interfaceRecord: undefined,
        moduleRecord: undefined
      },
      parent: parentInjectionRequest
    };

    try {

      applyUseOption(options, injectionRequest);

    } catch (e) {
      return Promise.reject(e);
    }

    var interfaceRecord = fireUp._internal.registry.findInterface(injectionRequest.usedInterface);
    injectionRequest._internal.interfaceRecord = interfaceRecord;

    if (_.isUndefined(interfaceRecord)) {
      err = new fireUp.errors.NoImplementationError(injectionRequest);
      fireUp.log.error({ err: err }, err.message);
      if (_.isUndefined(injectionRequest.parent)) {
        if (injectionRequest.usedInterface.match(/^fireUp\//m)) {
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
      err = new fireUp.errors.ConfigError('The module reference \'%s\' contains static args but the following implementation is not of type \'%s\': %s', injectionRequest.moduleReference, fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES, interfaceRecord.file);
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

        // TODO: Move upwards to also load fireUp interfaces through loadModule -> Makes those interfaces replaceable by e.g. a mock
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
    registerModules: registerModules,
    loadModule: loadModule
  };

}


module.exports = {
  newLoader: newLoader
};
