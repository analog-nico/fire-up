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
  this.thrownError = thrownError;

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


function NoImplementationError(injectionRequest) {

  this.name = 'NoImplementationError';
  this.message = util.format("No implementation found for the module reference '%s'.", injectionRequest.moduleReference);
  this.injectionRequest = injectionRequest;

  Error.captureStackTrace(this);

}
NoImplementationError.prototype = Object.create(Error.prototype);
NoImplementationError.prototype.constructor = NoImplementationError;


function InstanceInitializationError(moduleReference, moduleFile, thrownError) {

  this.name = 'InstanceInitializationError';
  this.message = util.format("An error occurred while creating an instance for '%s': %s", moduleReference, thrownError.message);
  this.moduleReference = moduleReference;
  this.moduleFile = moduleFile;
  this.thrownError = thrownError;

  Error.captureStackTrace(this);

}
InstanceInitializationError.prototype = Object.create(Error.prototype);
InstanceInitializationError.prototype.constructor = InstanceInitializationError;


module.exports = {
  ConfigError: ConfigError,
  ModuleLoadingError: ModuleLoadingError,
  InterfaceRegistrationConflictError: InterfaceRegistrationConflictError,
  NoImplementationError: NoImplementationError,
  InstanceInitializationError: InstanceInitializationError
};