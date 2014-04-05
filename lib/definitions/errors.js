'use strict';


function InitializationError(moduleReference, moduleFile, thrownError) {

  this.name = 'InitializationError';
  this.message = 'An error occurred while creating an instance for \'' + moduleReference + '\': ' + thrownError.message;
  this.moduleReference = moduleReference;
  this.moduleFile = moduleFile;
  this.thrownError = thrownError;

  Error.captureStackTrace(this);

}
InitializationError.prototype = Object.create(Error.prototype);
InitializationError.prototype.constructor = InitializationError;


module.exports = {
  InitializationError: InitializationError
};