'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var glob = require("simple-glob");
var path = require('path');

var Registry = require('./registry.js');
var descriptor = require('./descriptor.js');
var moduleHelpers = require('./module.js');


function newLoader(fireUp) {

  function registerModules() {

    fireUp._internal.registry = Registry.new(fireUp);

    var modulePaths = _.filter(fireUp._internal.options.modules, function (elem) {
      return _.isString(elem);
    });

    registerModulesFromPaths(modulePaths);

    var customModules = _.filter(fireUp._internal.options.modules, function (elem) {
      return _.isPlainObject(elem);
    });

    registerCustomModules(customModules);

    validateModuleDependencies();

  }

  function registerModulesFromPaths(modulePaths) {

    // Find module files
    var files = glob({ cwd: fireUp._internal.options.basePath }, modulePaths);
    for (var i = 0; i < files.length; i += 1) {

      var filePathAbsolute = path.join(fireUp._internal.options.basePath, files[i]);
      var filePathRelativeToCwd = path.relative(fireUp._internal.registry.basePathForFileRefs, filePathAbsolute);
      fireUp._internal.registry.modules[filePathRelativeToCwd] = Registry.newModuleEntry();

      // Check if they shall be used with fireUp
      var contents = fs.readFileSync(filePathAbsolute, 'utf8');
      if (contents.match(/^\s*\/\/\s*Fire\s*me\s*up\s*!\s*$/im) !== null) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.MODULE_STATUS_TO_LOAD;
      } else {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.MODULE_STATUS_TO_IGNORE;
        continue;
      }

      // Load the module
      var module;
      try {

        module = require(filePathAbsolute);
        module.__filename = filePathAbsolute;
        module.__dirname = path.dirname(filePathAbsolute);

      } catch (e) {
        fireUp._internal.registry.modules[filePathRelativeToCwd].status = fireUp.constants.MODULE_STATUS_LOAD_FAILED;
        var requireErr = new fireUp.errors.ModuleLoadingError(filePathAbsolute, e);
        fireUp.log.error({ err: requireErr }, requireErr.message + '\n' + e.stack);
        throw requireErr;
      }

      validateAndRegisterLoadedModule(module, filePathRelativeToCwd);

    }

  }

  function registerCustomModules(customModules) {

    for ( var i = 0; i < customModules.length; i+=1 ) {

      var registryId = 'Custom Module No. ' + (i+1) + ' passed to fireUpLib.newInjector(...)';

      fireUp._internal.registry.modules[registryId] = Registry.newModuleEntry();
      fireUp._internal.registry.modules[registryId].status = fireUp.constants.MODULE_STATUS_TO_LOAD;

      customModules[i].__filename = undefined;
      customModules[i].__dirname = fireUp._internal.options.basePath;

      validateAndRegisterLoadedModule(customModules[i], registryId);

    }

  }

  function validateAndRegisterLoadedModule(loadedModule, registryId) {

    try {

      moduleHelpers.validateModule(fireUp, loadedModule, registryId);

    } catch (e) {
      fireUp._internal.registry.modules[registryId].status = fireUp.constants.MODULE_STATUS_LOAD_FAILED;
      throw e;
    }

    loadedModule = moduleHelpers.addFactoryAdapterIfNeeded(loadedModule);

    fireUp._internal.registry.modules[registryId].cache.module = loadedModule;
    if (_.isString(loadedModule.implements)) {
      fireUp._internal.registry.modules[registryId].implements = [loadedModule.implements];
    } else {
      fireUp._internal.registry.modules[registryId].implements = loadedModule.implements;
    }
    if (_.isUndefined(loadedModule.inject) === false) {
      if (_.isString(loadedModule.inject)) {
        fireUp._internal.registry.modules[registryId].inject = [loadedModule.inject];
      } else {
        fireUp._internal.registry.modules[registryId].inject = loadedModule.inject;
      }
    }
    if (_.isString(loadedModule.type)) {
      fireUp._internal.registry.modules[registryId].type = loadedModule.type;
    }
    fireUp._internal.registry.modules[registryId].status = fireUp.constants.MODULE_STATUS_LOADED;

    // Step 4: Register the module
    var interfaces = loadedModule.implements;
    if (_.isString(interfaces)) {
      interfaces = [interfaces];
    }
    for (var k = 0; k < interfaces.length; k += 1) {

      fireUp._internal.registry.registerInterface(registryId, interfaces[k]);

    }
    fireUp._internal.registry.modules[registryId].status = fireUp.constants.MODULE_STATUS_REGISTERED;

  }

  function validateModuleDependencies() {

    // Validate that all interfaces are available for the required injections
    fireUp.log.info({}, 'Start validating all inject references...');

    _.forOwn(fireUp._internal.registry.modules, function (registryEntry, modulePath) {

      if (registryEntry.status !== fireUp.constants.MODULE_STATUS_REGISTERED) {
        return;
      }

      for (var r = 0; r < registryEntry.inject.length; r += 1) {

        var internalDependencies = ['fireUp/currentInjector', 'fireUp/injectionRequest', 'fireUp/options'];
        if (_.contains(internalDependencies, registryEntry.inject[r])) {
          continue;
        }

        if (descriptor.usesStarSelector(registryEntry.inject[r])) {
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
      implementedByVirtualModule: undefined,
      cachedModule: undefined,
      _internal: {
        interfaceRecord: undefined,
        moduleRecord: undefined
      },
      parent: parentInjectionRequest,
      nestingLevel: (_.isUndefined(parentInjectionRequest) ? 0 : parentInjectionRequest.nestingLevel+1)
    };

    if (descriptor.usesStarSelector(injectionRequest.moduleReference)) {
      return loadAllModules(injectionRequest, options);
    }

    return loadModule(injectionRequest, options);

  }

  function loadAllModules(injectionRequest, options) {

    var err;

    logInstantiationInfo(injectionRequest);

    injectionRequest.implementedByVirtualModule = true;

    var baseInterfaceReference = descriptor.formatInterfaceName(_.initial(injectionRequest.parsedModuleReference.segments));
    var baseInterface = fireUp._internal.registry.getInterface(baseInterfaceReference);
    injectionRequest._internal.interfaceRecord = baseInterface;

    var interfaceKeys = [];
    if (baseInterface && interfaceKeys.length === 0) {
      interfaceKeys = _.keys(baseInterface.interfaces);
    }

    throwIfInjectionMovesInCircles(injectionRequest);

    return new Promise(function (resolve) {

      function loadDependencyAndIgnoreNoImplementationError(interfaceName, options, injectionRequest) {

        try {
          return loadDependency(interfaceName, options, injectionRequest);
        } catch (e) {
          if (e instanceof fireUp.errors.NoImplementationError) {
            return undefined;
          } else {
            throw e;
          }
        }

      }

      var promisesForMatchingModules = [];
      for ( var i = 0; i < interfaceKeys.length; i+= 1 ) {
        promisesForMatchingModules.push(
          loadDependencyAndIgnoreNoImplementationError(baseInterface.interfaces[interfaceKeys[i]].interfaceName, options, injectionRequest)
        );
      }

      resolve(Promise.all(promisesForMatchingModules)
          .then(function (modules) {
            var loadedModules = {};
            for ( var i = 0; i < modules.length; i+=1 ) {
              if (_.isUndefined(modules[i])) {
                continue;
              }
              loadedModules[modules[i].interfaceName] = modules[i].instance;
            }
            return boxLoadedDependency(injectionRequest.moduleReference, loadedModules);
          }));

    });

  }

  function loadModule(injectionRequest, options) {

    var err;

    applyUseOption(options, injectionRequest);

    if (injectionRequest.usedInterface.match(/^fireUp\//m)) {
      if (injectionRequest.usedInterface === 'fireUp/currentInjector') {
        return Promise.resolve(boxLoadedDependency('fireUp/currentInjector', fireUp));
      } else if (injectionRequest.usedInterface === 'fireUp/injectionRequest') {
        return Promise.resolve(boxLoadedDependency('fireUp/injectionRequest', injectionRequest.parent));
      } else if (injectionRequest.usedInterface === 'fireUp/options') {
        return Promise.resolve(boxLoadedDependency('fireUp/options', options.toObject()));
      } else {
        var parsedUsedInterface = descriptor.parseInterfaceName(injectionRequest.usedInterface);
        if (parsedUsedInterface.length === 1 ||
            (parsedUsedInterface[0] !== 'fireUp/currentInjector' &&
                parsedUsedInterface[0] !== 'fireUp/injectionRequest' &&
                parsedUsedInterface[0] !== 'fireUp/options')) {
          fireUp.log.debug({}, 'The module reference \'%s\' does not match any interface provided by Fire Up!', injectionRequest.usedInterface);
          fireUp.log.debug({}, 'Currently Fire Up! provides: \'fireUp/currentInjector\', \'fireUp/injectionRequest\', and \'fireUp/options\'.');
        }
      }
    }

    var interfaceRecord = fireUp._internal.registry.findInterface(injectionRequest.usedInterface);
    injectionRequest._internal.interfaceRecord = interfaceRecord;

    logInstantiationInfo(injectionRequest);

    if (_.isUndefined(interfaceRecord)) {
      throwNoImplementationError(injectionRequest);
    }

    var moduleRecord = fireUp._internal.registry.modules[interfaceRecord.file];
    injectionRequest._internal.moduleRecord = moduleRecord;
    injectionRequest.cachedModule = moduleRecord.cache.module;
    injectionRequest.implementedByVirtualModule = false;

    if (moduleRecord.type !== fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES &&
        injectionRequest.parsedModuleReference.args.length > 0) {
      err = new fireUp.errors.ConfigError('The module reference \'%s\' contains static args but the following implementation is not of type \'%s\': %s', injectionRequest.moduleReference, fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES, interfaceRecord.file);
      fireUp.log.error(err);
      throw err;
    }

    throwIfInjectionMovesInCircles(injectionRequest);

    if (moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {
      var fill = ''; for ( var i = 0; i < injectionRequest.nestingLevel; i+= 1 ) { fill += '    '; }
      if (moduleRecord.cache.singletonInstance !== null) {
        fireUp.log.info({}, fill + "Returning cached module instance for interface '%s'.", injectionRequest._internal.interfaceRecord.interfaceName);
        return Promise.resolve(boxLoadedDependency(interfaceRecord.interfaceName, moduleRecord.cache.singletonInstance));
      } else if (moduleRecord.cache.instantiationPromise !== null) {
        fireUp.log.info({}, fill + "Will return already requested module instance for interface '%s'.", injectionRequest._internal.interfaceRecord.interfaceName);
        return moduleRecord.cache.instantiationPromise;
      }
    }

    var promise = new Promise(function (resolve) {

      var promisesForInjectedModules = [];
      for ( var i = 0; i < moduleRecord.inject.length; i+= 1 ) {

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

              resolve(moduleRecord.cache.module.factory.apply(moduleRecord.cache.module, modules));

            })
            .catch(function (e) {
              var initErr = new fireUp.errors.InstanceInitializationError(injectionRequest, interfaceRecord.file, e);
              fireUp.log.error({ err: initErr }, initErr.message + '\n' + e.stack);
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
    fireUp.log.error(err);
    if (_.isUndefined(injectionRequest.parent)) {
      fireUp.log.debug({}, 'The implementation was directly requested by a fireUp call.');
    } else {
      fireUp.log.debug({}, 'The implementation was requested to be injected into the module with the source file at \'%s\'.', injectionRequest.parent._internal.interfaceRecord.file);
    }
    throw err;

  }

  function throwIfInjectionMovesInCircles(injectionRequest) {
    if (injectionMovesInCircles(injectionRequest)) {
      var err = new fireUp.errors.CircularDependencyError(injectionRequest);
      fireUp.log.error(err);
      throw err;
    }
  }

  function injectionMovesInCircles(injectionRequest) {

    if (injectionRequest.implementedByVirtualModule === true) {
      return false;
    }

    if (injectionRequest._internal.moduleRecord.type === fireUp.constants.MODULE_TYPE_SINGLETON) {

      var tempInjectionRequest = injectionRequest.parent;
      while (_.isUndefined(tempInjectionRequest) === false) {
        if (tempInjectionRequest.implementedByVirtualModule === false &&
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
    var searchStringForExtendedInterfaces = requestedInterface + ':';

    if (_.isUndefined(injectionRequest.parent) === false &&
        injectionRequest.parent.implementedByVirtualModule === false) {

      for ( var i = 0; i < injectionRequest.parent._internal.moduleRecord.implements.length; i+=1 ) {

        if (injectionRequest.parent._internal.moduleRecord.implements[i].substr(0, searchStringForExtendedInterfaces.length) === searchStringForExtendedInterfaces) {
          // Requesting module implements an extended interface of the requested one. E.g. the module is a wrapper.
          // Use options do not apply.
          injectionRequest.usedInterface = requestedInterface;
          return;
        }

      }

    }

    var extendedInterfaces = _.filter(options.use, function (entry) {
      return entry.substr(0, searchStringForExtendedInterfaces.length) === searchStringForExtendedInterfaces;
    });

    if (extendedInterfaces.length === 0) {
      injectionRequest.usedInterface = requestedInterface;
      return;
    } else if (extendedInterfaces.length === 1) {
      injectionRequest.usedInterface = extendedInterfaces[0];
      return;
    }

    var parsedExtendedInterfaces = _.map(extendedInterfaces, descriptor.parseInterfaceName);
    var maxNesting = _.max(parsedExtendedInterfaces, 'length').length;
    var extendedInterfacesWithDeepestNesting = _.filter(parsedExtendedInterfaces, function (entry) {
      return entry.length === maxNesting;
    });

    if (extendedInterfacesWithDeepestNesting.length === 1) {

      var allInterfacesAreCompatible = true;

      for ( var k = 0; k < parsedExtendedInterfaces.length; k+=1 ) {
        if (_.isEqual(parsedExtendedInterfaces[k], _.first(extendedInterfacesWithDeepestNesting[0], parsedExtendedInterfaces[k].length)) === false) {
          allInterfacesAreCompatible = false;
          break;
        }
      }

      if (allInterfacesAreCompatible === true) {
        injectionRequest.usedInterface = descriptor.formatInterfaceName(extendedInterfacesWithDeepestNesting[0]);
        return;
      }

    }

    var err = new fireUp.errors.UseOptionConflictError(requestedInterface, extendedInterfaces, injectionRequest);
    logInstantiationInfo(injectionRequest);
    fireUp.log.error(err);
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
