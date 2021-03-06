'use strict';

var util = require('util');


function ConfigError(message) {

  this.name = 'ConfigError';
  this.message = util.format.apply(undefined, arguments);

  Error.captureStackTrace(this);

}
ConfigError.prototype = Object.create(TypeError.prototype);
ConfigError.prototype.constructor = ConfigError;


function ModuleLoadingError(moduleFile, thrownError) {

  this.name = 'ModuleLoadingError';
  this.message = util.format("Loading the module through require('%s') failed: %s", moduleFile, thrownError.message);
  this.moduleFile = moduleFile;
  this.cause = thrownError;

  Error.captureStackTrace(this);

}
ModuleLoadingError.prototype = Object.create(Error.prototype);
ModuleLoadingError.prototype.constructor = ModuleLoadingError;


function InterfaceRegistrationConflictError(implementedInterface, conflictingFiles) {

  this.name = 'InterfaceRegistrationConflictError';
  this.message = util.format("Some modules conflict by implementing the same interface '%s'.", implementedInterface);
  this.interfaceName = implementedInterface;
  this.conflictingFiles = conflictingFiles;

  Error.captureStackTrace(this);

}
InterfaceRegistrationConflictError.prototype = Object.create(Error.prototype);
InterfaceRegistrationConflictError.prototype.constructor = InterfaceRegistrationConflictError;


function UseOptionConflictError(requestedInterface, conflictingInterfacesToUse, injectionRequest) {

  this.name = 'UseOptionConflictError';
  this.message = util.format("The current use options are ambiguous in regard to which interface to use for '%s'.", requestedInterface);
  this.requestedInterface = requestedInterface;
  this.conflictingInterfacesToUse = conflictingInterfacesToUse;
  this.injectionRequest = injectionRequest;

  Error.captureStackTrace(this);

}
UseOptionConflictError.prototype = Object.create(Error.prototype);
UseOptionConflictError.prototype.constructor = UseOptionConflictError;


function NoImplementationError(injectionRequest) {

  this.name = 'NoImplementationError';
  this.message = util.format("No implementation found for the module reference '%s'.", injectionRequest.moduleReference);
  this.injectionRequest = injectionRequest;

  Error.captureStackTrace(this);

}
NoImplementationError.prototype = Object.create(Error.prototype);
NoImplementationError.prototype.constructor = NoImplementationError;


function InstanceInitializationError(injectionRequest, moduleFile, thrownError) {

  this.name = 'InstanceInitializationError';
  this.message = util.format("An error occurred while creating an instance for '%s': %s", injectionRequest.usedInterface, thrownError.message);
  this.moduleFile = moduleFile;
  this.cause = thrownError;
  this.injectionRequest = injectionRequest;

  Error.captureStackTrace(this);

}
InstanceInitializationError.prototype = Object.create(Error.prototype);
InstanceInitializationError.prototype.constructor = InstanceInitializationError;


function CircularDependencyError(injectionRequest) {

  this.name = 'InstanceInitializationError';
  this.message = 'A circular dependency was detected.';
  this.injectionRequest = injectionRequest;

  Error.captureStackTrace(this);

}
CircularDependencyError.prototype = Object.create(Error.prototype);
CircularDependencyError.prototype.constructor = CircularDependencyError;


module.exports = {
  ConfigError: ConfigError,
  ModuleLoadingError: ModuleLoadingError,
  InterfaceRegistrationConflictError: InterfaceRegistrationConflictError,
  UseOptionConflictError: UseOptionConflictError,
  NoImplementationError: NoImplementationError,
  InstanceInitializationError: InstanceInitializationError,
  CircularDependencyError: CircularDependencyError
};
