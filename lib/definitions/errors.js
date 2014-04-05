'use strict';


function InitializationError(moduleReference, moduleFile, thrownError) {
  this.name = 'InitializationError';
  this.message = 'An error occurred while creating an instance for \'' + moduleReference + '\': ' + thrownError.message;
  this.moduleReference = moduleReference;
  this.moduleFile = moduleFile;
  this.thrownError = thrownError;
}
InitializationError.prototype = Error.prototype;

module.exports = {
  InitializationError: InitializationError
};