'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var glob = require("simple-glob");
var path = require('path');

var Registry = require('./registry.js');
var descriptor = require('./descriptor.js');


function newLoader(fireUp) {

  function validateModule(module, filePathAbsolute) {

    var err, i;

    if (_.isPlainObject(module) === false) {
      err = new fireUp.errors.ConfigError("The following module does not export an object: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "At minimum the following statement is required: module.exports = { implements: '<module interface>', factory: <function> };");
      throw err;
    }

    if (_.isUndefined(module.implements)) {
      err = new fireUp.errors.ConfigError("The following module does not export the exports.implements property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "You may assign a string denoting the interface implemented by the module or an array of strings for multiple interfaces.");
      throw err;
    } else if (_.isString(module.implements) === false && _.isArray(module.implements) === false) {
      err = new fireUp.errors.ConfigError("The following module exports the exports.implements property in the wrong format: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, "You may assign a string denoting the interface implemented by the module or an array of strings for multiple interfaces.");
      throw err;
    }

    if (_.isArray(module.implements)) {

      for ( i = 0; i < module.implements.length; i+=1 ) {
        validateModuleImplementsEntry(module.implements[i], i, filePathAbsolute);
      }

      if (_.uniq(module.implements).length < module.implements.length) {
        err = new fireUp.errors.ConfigError("The following module exports duplicated interface names in the exports.implements property: %s", filePathAbsolute);
        fireUp.log.error({ err: err }, err.message);
        throw err;
      }

    } else {
      validateModuleImplementsEntry(module.implements, null, filePathAbsolute);
    }

    if (_.isUndefined(module.inject) === false) {

      if (_.isString(module.inject) === false && _.isArray(module.inject) === false) {
        err = new fireUp.errors.ConfigError("The following module exports the exports.inject property in the wrong format: %s", filePathAbsolute);
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({}, "You should assign an array of strings that reference the interfaces for which an implementation shall be injected.");
        throw err;
      }

      if (_.isArray(module.inject)) {
        for ( i = 0; i < module.inject.length; i+=1 ) {
          validateModuleInjectEntry(module.inject[i], i, filePathAbsolute);
        }
      } else {
        validateModuleInjectEntry(module.inject, null, filePathAbsolute);
      }

      var injectedOwnInterfaces = _.intersection(
          _.isArray(module.implements) ? module.implements : [module.implements],
          _.isArray(module.inject) ? module.inject : [module.inject]
      );
      if (injectedOwnInterfaces.length > 0) {
        err = new fireUp.errors.ConfigError("The following module get one or more of its own interfaces injected: %s", filePathAbsolute);
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({ injectedOwnInterfaces: injectedOwnInterfaces }, "Please make sure that exports.implements and exports.inject are distinct.");
        throw err;
      }

    }

    if (_.isUndefined(module.type) === false) {

      if (_.isString(module.type) === false ||
          (module.type !== fireUp.constants.MODULE_TYPE_SINGLETON && module.type !== fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES)) {
        err = new fireUp.errors.ConfigError("The following module exports an invalid module type through the exports.type property: %s", filePathAbsolute);
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({}, "Please use either '%s' (default) or '%s'.", fireUp.constants.MODULE_TYPE_SINGLETON, fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES);
        throw err;
      }

    }

    if (_.isUndefined(module.factory)) {
      err = new fireUp.errors.ConfigError("The following module did not export a function through the exports.factory property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      throw err;
    } else if (_.isFunction(module.factory) === false) {
      err = new fireUp.errors.ConfigError("The following module exports a value through the exports.factory property that is not a function: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      throw err;
    }

  }

  function validateModuleImplementsEntry(entry, i, filePathAbsolute) {
    if (_.isString(entry) === false || entry.length === 0 || descriptor.validateInterfaceName(entry) === false) {
      var err = new fireUp.errors.ConfigError("The following module exports an invalid interface name " + (i ? "at index " + i + " of" : "through") + " the exports.implements property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, 'A valid interface name must not contain whitespaces, stars, nor parenthesises.');
      throw err;
    }
  }

  function validateModuleInjectEntry(entry, i, filePathAbsolute) {
    if (_.isString(entry) === false || entry.length === 0 || descriptor.validateModuleReference(entry) === false) {
      var err = new fireUp.errors.ConfigError("The following module exports an invalid module reference " + (i ? "at index " + i + " of" : "through") + " the exports.inject property: %s", filePathAbsolute);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, 'A valid module reference must not contain whitespaces and use parenthesises only at the end.');
      if (entry.match(/\*/)) {
        fireUp.log.debug({}, "The star selector is only available as a ':*' suffix.");
      }
      throw err;
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
      if (_.isString(module.implements)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].implements = [module.implements];
      } else {
        fireUp._internal.registry.modules[filePathRelativeToCwd].implements = module.implements;
      }
      if (_.isUndefined(module.inject) === false) {
        if (_.isString(module.inject)) {
          fireUp._internal.registry.modules[filePathRelativeToCwd].inject = [module.inject];
        } else {
          fireUp._internal.registry.modules[filePathRelativeToCwd].inject = module.inject;
        }
      }
      if (_.isString(module.type)) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].type = module.type;
      }
      module.__filename = filePathAbsolute;
      module.__dirname = path.dirname(filePathAbsolute);
      fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.FILE_STATUS_LOADED;

      // Step 4: Register the module
      var interfaces = module.implements;
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

  function loadDependency(moduleReference, options, parentInjectionRequest) {

    var injectionRequest = {
      moduleReference: moduleReference,
      parsedModuleReference: descriptor.parseModuleReference(moduleReference),
      usedInterface: undefined,
      cachedModule: undefined,
      _internal: {
        interfaceRecord: undefined,
        moduleRecord: undefined
      },
      parent: parentInjectionRequest,
      nestingLevel: (_.isUndefined(parentInjectionRequest) ? 0 : parentInjectionRequest.nestingLevel+1)
    };

    if (_.last(injectionRequest.parsedModuleReference.segments) === '*') {
      return loadAllModules(injectionRequest, options);
    }

    return loadModule(injectionRequest, options);

  }

  function loadAllModules(injectionRequest, options) {

    var err;

    logInstantiationInfo(injectionRequest);

    var baseInterfaceReference = descriptor.formatInterfaceName(_.initial(injectionRequest.parsedModuleReference.segments));
    var baseInterface = fireUp._internal.registry.getInterface(baseInterfaceReference);
    injectionRequest._internal.interfaceRecord = baseInterface;

    if (_.isUndefined(baseInterface)) {
      throwNoImplementationError(injectionRequest);
    }

    var interfaceKeys = _.keys(baseInterface.interfaces);
    if (interfaceKeys.length === 0) {
      throwNoImplementationError(injectionRequest);
    }

    throwIfInjectionMovesInCircles(injectionRequest);

    return new Promise(function (resolve) {

      var promisesForMatchingModules = [];
      for ( var i = 0; i < interfaceKeys.length; i+= 1 ) {
        promisesForMatchingModules.push(loadDependency(baseInterface.interfaces[interfaceKeys[i]].interfaceName, options, injectionRequest));
      }

      resolve(Promise.all(promisesForMatchingModules)
          .then(function (modules) {
            var loadedModules = {};
            for ( var i = 0; i < modules.length; i+=1 ) {
              loadedModules[modules[i].interfaceName] = modules[i].instance;
            }
            return boxLoadedDependency(injectionRequest.moduleReference, loadedModules);
          }));

    });

  }

  function loadModule(injectionRequest, options) {

    var err;

    applyUseOption(options, injectionRequest);

    var interfaceRecord = fireUp._internal.registry.findInterface(injectionRequest.usedInterface);
    injectionRequest._internal.interfaceRecord = interfaceRecord;

    logInstantiationInfo(injectionRequest);

    if (_.isUndefined(interfaceRecord)) {
      throwNoImplementationError(injectionRequest);
    }

    var moduleRecord = fireUp._internal.registry.modules[interfaceRecord.file];
    injectionRequest._internal.moduleRecord = moduleRecord;
    injectionRequest.cachedModule = moduleRecord.cache.module;

    if (moduleRecord.type !== fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES &&
        injectionRequest.parsedModuleReference.args.length > 0) {
      err = new fireUp.errors.ConfigError('The module reference \'%s\' contains static args but the following implementation is not of type \'%s\': %s', injectionRequest.moduleReference, fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES, interfaceRecord.file);
      fireUp.log.error({ err: err }, err.message);
      throw err;
    }

    throwIfInjectionMovesInCircles(injectionRequest);

    if (moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {
      if (moduleRecord.cache.singletonInstance !== null) {
        var fill = '';
        for ( var i = 0; i < injectionRequest.nestingLevel; i+= 1 ) {
          fill += '    ';
        }
        fireUp.log.info({}, fill + "Returning cached module instance for interface '%s'.", injectionRequest._internal.interfaceRecord.interfaceName);
        return Promise.resolve(boxLoadedDependency(interfaceRecord.interfaceName, moduleRecord.cache.singletonInstance));
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

        promisesForInjectedModules.push(
            loadDependency(moduleRecord.inject[i], options, injectionRequest)
                .then(unboxLoadedDependency)
        );

      }

      resolve(Promise.all(promisesForInjectedModules)
          .then(function (modules) {
            return new Promise(function (resolve) {
              for ( var k = 0; k < injectionRequest.parsedModuleReference.args.length; k+=1 ) {
                modules.push(injectionRequest.parsedModuleReference.args[k]);
              }

              resolve(moduleRecord.cache.module.factory.apply(undefined, modules));

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
              return boxLoadedDependency(interfaceRecord.interfaceName, instance);
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

  function logInstantiationInfo(injectionRequest) {
    var info = '';
    for ( var i = 0; i < injectionRequest.nestingLevel; i+= 1 ) {
      info += (i < injectionRequest.nestingLevel-1 ? '    ' : '|-- ');
    }
    info += 'Requested: ' + injectionRequest.moduleReference;
    if (_.isUndefined(injectionRequest.usedInterface) === false &&
        descriptor.convertModuleReferenceToInterfaceName(injectionRequest.moduleReference) !== injectionRequest.usedInterface) {
      info += ', but using: ' + injectionRequest.usedInterface;
    }
    if (_.isUndefined(injectionRequest._internal.interfaceRecord) === false) {
      if (injectionRequest.usedInterface !== injectionRequest._internal.interfaceRecord.interfaceName) {
        info += ', but only available: ' + injectionRequest._internal.interfaceRecord.interfaceName;
      }
      if (injectionRequest._internal.interfaceRecord.interfaceName !== 'require') {
        info += ', implemented in: ' + injectionRequest._internal.interfaceRecord.file;
      }
    }
    fireUp.log.info({}, info);
  }

  function throwNoImplementationError(injectionRequest) {

    var err = new fireUp.errors.NoImplementationError(injectionRequest);
    fireUp.log.error({ err: err }, err.message);
    if (_.isUndefined(injectionRequest.parent)) {
      if (injectionRequest.usedInterface.match(/^fireUp\//m)) {
        fireUp.log.debug({}, 'The implementation was directly requested by a fireUp call. However, an interface like \'fireUp/...\' is only available through injection.');
      } else {
        fireUp.log.debug({}, 'The implementation was directly requested by a fireUp call.');
      }
    } else {
      // FIXME: interfaceRecord might be undefined if parent request was for a * selector. Also check if this affects other code as well.
      fireUp.log.debug({}, 'The implementation was requested to be injected into the module with the source file at \'%s\'.', injectionRequest.parent._internal.interfaceRecord.file);
    }
    throw err;

  }

  function throwIfInjectionMovesInCircles(injectionRequest) {
    if (injectionMovesInCircles(injectionRequest)) {
      var err = new fireUp.errors.CircularDependencyError(injectionRequest);
      fireUp.log.error({ err: err }, err.message);
      throw err;
    }
  }

  function injectionMovesInCircles(injectionRequest) {

    if (_.isUndefined(injectionRequest._internal.moduleRecord)) {
      // TODO: Algorithm for star selector needed.
      return false;
    }

    if (injectionRequest._internal.moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {

      var tempInjectionRequest = injectionRequest.parent;
      while (_.isUndefined(tempInjectionRequest) === false) {
        if (_.isUndefined(tempInjectionRequest._internal.interfaceRecord) === false &&
            tempInjectionRequest._internal.interfaceRecord.file === injectionRequest._internal.interfaceRecord.file) {
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

    if (_.isUndefined(injectionRequest.parent) === false &&
        _.isUndefined(injectionRequest.parent._internal.moduleRecord) === false) {

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
    var maxNesting = _.max(parsedSubInterfaces, 'length').length;
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
    logInstantiationInfo(injectionRequest);
    fireUp.log.error({ err: err }, err.message);
    throw err;

  }

  function boxLoadedDependency(interfaceName, instance) {
    return {
      interfaceName: interfaceName,
      instance: instance
    };
  }

  function unboxLoadedDependency(boxedModule) {
    return boxedModule.instance;
  }

  return {
    registerModules: registerModules,
    loadDependency: loadDependency,
    unboxLoadedDependency: unboxLoadedDependency
  };

}


module.exports = {
  newLoader: newLoader
};
