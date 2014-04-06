'use strict';


function InstanceInitializationError(moduleReference, moduleFile, thrownError) {

  this.name = 'InstanceInitializationError';
  this.message = 'An error occurred while creating an instance for \'' + moduleReference + '\': ' + thrownError.message;
  this.moduleReference = moduleReference;
  this.moduleFile = moduleFile;
  this.thrownError = thrownError;

  Error.captureStackTrace(this);

}
InstanceInitializationError.prototype = Object.create(Error.prototype);
InstanceInitializationError.prototype.constructor = InstanceInitializationError;


function ModuleLoadingError(moduleFile, thrownError) {

  this.name = 'ModuleLoadingError';
  this.message = 'Loading the module through require(\'' + moduleFile + '\') failed: ' + thrownError.message;
  this.moduleFile = moduleFile;
  this.thrownError = thrownError;

  Error.captureStackTrace(this);

}
ModuleLoadingError.prototype = Object.create(Error.prototype);
ModuleLoadingError.prototype.constructor = ModuleLoadingError;


module.exports = {
  InstanceInitializationError: InstanceInitializationError,
  ModuleLoadingError: ModuleLoadingError
};