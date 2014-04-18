'use strict';

var _ = require('lodash');
var path = require('path');

var constants = require('../definitions/constants.js');
var descriptor = require('./descriptor.js');


function newModuleEntry() {

  return {
    type: constants.MODULE_TYPE_SINGLETON,
    inject: [],
    status: constants.FILE_STATUS_UNCHECKED,
    cache: {
      module: null,
      instantiationPromise: null,
      singletonInstance: null
    }
  };

}


function newInterfaceEntry(interfaceName) {

  return {
    interfaceName: interfaceName,
    interfaces: [],
    file: null,
    conflictingFiles: null
  };

}


function newRegistry(fireUp) {

  var registry = {

    basePathForFileRefs: process.cwd(),
    modules: {},
    interfaces: {}

  };

  registry.registerInterface = function (filePathRelativeToCwd, implementedInterface) {

    var interfaceChain = descriptor.parseInterfaceName(implementedInterface);
    var registryPointer = fireUp._internal.registry.interfaces;
    var currentInterface = "";

    for ( var p = 0; p < interfaceChain.length; p+=1 ) {

      if (p > 0) {
        currentInterface += ":";
      }
      currentInterface += interfaceChain[p];

      if (_.isPlainObject(registryPointer[interfaceChain[p]]) === false) {
        registryPointer[interfaceChain[p]] = newInterfaceEntry(currentInterface);
      }

      // Check for conflicts when arriving at last sub interface
      if (p === interfaceChain.length-1) {

        if (_.isNull(registryPointer[interfaceChain[p]].file) === false ||
            _.isNull(registryPointer[interfaceChain[p]].conflictingFiles) === false) {

          if (_.isNull(registryPointer[interfaceChain[p]].conflictingFiles)) {
            registryPointer[interfaceChain[p]].conflictingFiles = [];
          }
          if (_.isNull(registryPointer[interfaceChain[p]].file) === false) {
            registryPointer[interfaceChain[p]].conflictingFiles.push(registryPointer[interfaceChain[p]].file);
            registryPointer[interfaceChain[p]].file = null;
          }
          registryPointer[interfaceChain[p]].conflictingFiles.push(filePathRelativeToCwd);

          var err = new fireUp.errors.InterfaceRegistrationConflictError(currentInterface, registryPointer[interfaceChain[p]].conflictingFiles);
          fireUp.log.error({ err: err }, err.message);
          throw err;

        }

        registryPointer[interfaceChain[p]].file = filePathRelativeToCwd;
        fireUp.log.info({}, 'Registered module at \'%s\' as implementation for interface \'%s\'.', filePathRelativeToCwd, currentInterface);

      }

      registryPointer = registryPointer[interfaceChain[p]].interfaces;

    }

  };

  registry.findInterface = function (moduleReference) {

    var segments = descriptor.parseModuleReference(moduleReference).segments;
    var registryPointer = registry.interfaces;

    var lastImplementedInterface = "";

    for ( var i = 0; i < segments.length; i+=1 ) {

      if (_.isUndefined(registryPointer[segments[i]])) {
        fireUp.log.warn({}, "No implementation found for the module reference '%s'.", moduleReference);
        if (lastImplementedInterface !== "") {
          fireUp.log.debug({}, "FYI there is an implementation for the more general interface '%s'.", lastImplementedInterface);
        }
        return;
      }

      if (i < segments.length-1) {

        if (_.isString(registryPointer[segments[i]].file)) {
          lastImplementedInterface = registryPointer[segments[i]].interfaceName;
        }
        registryPointer = registryPointer[segments[i]].interfaces;

      } else {

        if (_.isString(registryPointer[segments[i]].file)) {
          return registryPointer[segments[i]];
        } else if (_.isArray(registryPointer[segments[i]].conflictingFiles)) {
          fireUp.log.warn({
            interfaceName: registryPointer[segments[i]].interfaceName,
            conflictingFiles: registryPointer[segments[i]].conflictingFiles
          }, "No implementation available for the module reference '%s' due to conflicting implementations for the same interface.", moduleReference);
          return;
        }

      }

    }

    // Get a more specific implementation if unambiguous
    var parentSegment;
    var currentSegment = segments[segments.length-1];
    var interfaces;
    while ((interfaces = _.keys(registryPointer[currentSegment].interfaces)).length === 1) {

      registryPointer = registryPointer[currentSegment].interfaces;
      parentSegment = currentSegment;
      currentSegment = interfaces[0];

      if (_.isString(registryPointer[currentSegment].file)) {
        return registryPointer[currentSegment];
      } else if (_.isArray(registryPointer[currentSegment].conflictingFiles)) {
        fireUp.log.warn({
          interfaceName: registryPointer[currentSegment].interfaceName,
          conflictingFiles: registryPointer[currentSegment].conflictingFiles
        }, "No implementation available for the module reference '%s' due to conflicting implementations for the same interface.", moduleReference);
        return;
      }

    }

    fireUp.log.warn({}, "No exact or more specific, unambiguous implementation found for the module reference '%s'.", moduleReference);
    if (interfaces.length > 1) {
      fireUp.log.debug({
        interfaces: interfaces
      }, 'There are multiple implementations for more specific interfaces. However, the ambiguity prohibits loading a more specific implementation.');
    }
    return;

  };

  return registry;

}


module.exports = {
  newModuleEntry: newModuleEntry,
  newInterfaceEntry: newInterfaceEntry,
  new: newRegistry
};
