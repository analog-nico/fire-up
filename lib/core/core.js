'use strict';

var loader = require('./loader.js');
var logger = require('./logger.js');
var Options = require('./options.js');
var descriptor = require('./descriptor.js');

var _ = require('lodash');
var Promise = require('bluebird');


function createNewInjector(options) {

  var fireUp = function (moduleReference, options) {

    var err;

    if (descriptor.validateModuleReference(moduleReference) === false) {
      err = new fireUp.errors.ConfigError("The module reference '%s' passed to fireUp(...) is invalid.", moduleReference);
      fireUp.log.error({ err: err }, err.message);
      fireUp.log.debug({}, 'A valid module reference must not contain whitespaces and use parenthesises only at the end.');
      return Promise.reject(err);
    }

    if (_.isUndefined(options) === false) {

      if (_.isPlainObject(options) === false) {
        err = new fireUp.errors.ConfigError('Please pass an object for the options parameter to fireUp(...).');
        fireUp.log.error({ err: err }, err.message);
        return Promise.reject(err);
      }

      if (_.isUndefined(options.basePath) === false) {
        err = new fireUp.errors.ConfigError("'options.basePath' cannot be set by passing it to fireUp(...). Please remove the property from the options you passed.");
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({}, "'options.basePath' must be provided when creating a new injector and is immutable for that injector.");
        return Promise.reject(err);
      }

      if (_.isUndefined(options.modules) === false) {
        err = new fireUp.errors.ConfigError("'options.modules' cannot be set by passing it to fireUp(...). Please remove the property from the options you passed.");
        fireUp.log.error({ err: err }, err.message);
        fireUp.log.debug({}, "'options.modules' must be provided when creating a new injector and is immutable for that injector.");
        return Promise.reject(err);
      }

      try {
        loaderInstance.validateUseOptions(options, 'fireUp(...)');
      } catch (e) {
        return Promise.reject(e);
      }

    }

    var mergedOptions = new Options();
    _.assign(mergedOptions, _.cloneDeep(fireUp._internal.options));
    _.assign(mergedOptions, _.cloneDeep(options));

    return loaderInstance.loadModule(moduleReference, mergedOptions);

  };

  fireUp.constants = require('../definitions/constants.js');
  fireUp.errors = require('../definitions/errors.js');
  fireUp.log = logger.newLogger();
  fireUp._internal = {};

  if (_.isPlainObject(options) === false) {
    var err = new fireUp.errors.ConfigError('Please pass an object for the options parameter to newInjector(...).');
    fireUp.log.error({ err: err }, err.message);
    throw err;
  }

  fireUp._internal.options = new Options();
  _.assign(fireUp._internal.options, _.cloneDeep(options));

  var loaderInstance = loader.newLoader(fireUp);
  loaderInstance.processOptions(options);

  loaderInstance.registerModules();

  return fireUp;

}


module.exports = {
  createNewInjector: createNewInjector
};
