'use strict';

var loader = require('./loader.js');
var logger = require('./logger.js');

var _ = require('lodash');


function createNewInjector(options) {

  var fireUp = function (moduleReference, options) {
    var mergedOptions = _.cloneDeep(fireUp._internal.options);
    _.extend(mergedOptions, options);
    return loaderInstance.loadModule(moduleReference, mergedOptions);
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
