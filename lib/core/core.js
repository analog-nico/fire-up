'use strict';

var loader = require('./loader.js');
var logger = require('./logger.js');
var Options = require('./options.js');
var descriptor = require('./descriptor.js');

var _ = require('lodash');
var BPromise = require('bluebird');
var path = require('path');


function getStandardModulePaths(basePath) {
  var stdModulesFolder = path.relative(basePath, path.join(__dirname,'../std'));
  return [stdModulesFolder + "/**/*.js"];
}


function createNewInjector(options) {

  var fireUp = function (moduleReference, options) {

    try {

      if (descriptor.validateModuleReference(moduleReference) === false) {
        var err = new fireUp.errors.ConfigError("The module reference '%s' passed to fireUp(...) is invalid.", moduleReference);
        fireUp.log.error(err);
        fireUp.log.debug({}, 'A valid module reference must not contain whitespaces and use parenthesises only at the end.');
        if (moduleReference.match(/\*/)) {
          fireUp.log.debug({}, "The star selector is only available as a ':*' suffix.");
        }
        throw err;
      }

      if (_.isUndefined(options) === false) {
        Options.validateOptionsType(options, 'fireUp(...)', fireUp.log);
        Options.ensureImmutablePropertiesAreNotSet(options, 'fireUp(...)', fireUp.log);
        Options.validateUseOptions(options, 'fireUp(...)', fireUp.log);
      }

      var mergedOptions = new Options();
      mergedOptions.add(fireUp._internal.options);
      mergedOptions.add(options);

      return loaderInstance.loadDependency(moduleReference, mergedOptions)
          .then(loaderInstance.unboxLoadedDependency);

    } catch (e) {
      return BPromise.reject(e);
    }

  };

  fireUp.constants = require('../definitions/constants.js');
  fireUp.errors = require('../definitions/errors.js');
  fireUp.log = logger.newLogger();
  fireUp._internal = {};

  Options.validateOptionsType(options, 'newInjector(...)', fireUp.log);
  Options.validateBasePath(options, 'newInjector(...)', fireUp.log);
  Options.validateModulesOption(options, 'newInjector(...)', fireUp.log);
  Options.validateUseOptions(options, 'newInjector(...)', fireUp.log);
  Options.validateBustRequireCacheOption(options, 'newInjector(...)', fireUp.log);

  fireUp._internal.options = new Options();
  fireUp._internal.options.add(options);
  fireUp._internal.options.add({ modules: getStandardModulePaths(fireUp._internal.options.basePath) });

  var loaderInstance = loader.newLoader(fireUp);
  loaderInstance.registerModules();

  return fireUp;

}


module.exports = {
  createNewInjector: createNewInjector
};
