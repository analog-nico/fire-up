'use strict';

var loader = require('./loader.js');
var logger = require('./logger.js');


function createNewInjector(options) {

  var fireUp = function (moduleReference) {
    return loaderInstance.loadModule(moduleReference);
  };

  fireUp.constants = require('../definitions/constants.js');
  fireUp.errors = require('../definitions/errors.js');

  fireUp.log = logger.newLogger();

  fireUp._internal = {};

  var loaderInstance = loader.newLoader(fireUp);
  loaderInstance.processOptions(options);

  loaderInstance.registerModules();

  return fireUp;
}


module.exports = {
  createNewInjector: createNewInjector
};
