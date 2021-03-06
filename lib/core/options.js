'use strict';

var errors = require('../definitions/errors.js');
var descriptor = require('./descriptor.js');

var _ = require('lodash');
var fs = require('fs');


function Options() {

  Object.defineProperty(this, 'modules', {
    get: function () {
      return this.__modules;
    },
    set: function (array) {
      if (_.isUndefined(this.__modules)) {
        this.__modules = _.uniq(array);
      } else {
        this.__modules = _.union(this.__modules, array);
      }
    }
  });

  Object.defineProperty(this, 'use', {
    get: function () {
      return this.__use;
    },
    set: function (array) {
      if (_.isUndefined(this.__use)) {
        this.__use = _.uniq(array);
      } else {
        this.__use = _.union(this.__use, array);
      }
    }
  });


  this.basePath = undefined;
  this.modules = [];
  this.use = [];

}
Options.prototype = Object.create(Object.prototype);
Options.prototype.constructor = Options;

Options.prototype.add = function (options) {

  var clonedOptions = _.cloneDeep(options);

  if (_.isPlainObject(options) && _.isArray(options.modules)) {
    for ( var i = 0; i < options.modules.length; i+=1 ) {

      if (_.isPlainObject(options.modules[i]) === false || _.isUndefined(options.modules[i].instance) === true) {
        continue;
      }

      // The instance value of custom modules must not be cloned.
      clonedOptions.modules[i].instance = options.modules[i].instance;

    }
  }

  _.assign(this, clonedOptions);

};

Options.prototype.toObject = function () {
  var obj = _.pick(this, _.without(_.keys(this), '__modules', '__use'));
  obj.modules = this.modules;
  obj.use = this.use;
  return obj;
};


Options.validateOptionsType = function (options, functionName, logger) {

  if (_.isPlainObject(options) === false) {
    var err = new errors.ConfigError('Please pass an object for the options parameter to %s.', functionName);
    logger.error(err);
    throw err;
  }

};

Options.validateBasePath = function (options, functionName, logger) {

  var err;

  if (_.isString(options.basePath) === false || options.basePath.length === 0) {
    err = new errors.ConfigError('Please pass an absolute path for options.basePath to %s.', functionName);
    logger.error(err);
    logger.debug({}, 'Paths passed through options.modules are resolved relative to options.basePath. You may e.g. pass __dirname for options.basePath.');
    throw err;
  }

  if (fs.existsSync(options.basePath) === false) {
    err = new errors.ConfigError('Please pass a valid absolute path for options.basePath to %s. You passed: %s', functionName, options.basePath);
    logger.error(err);
    throw err;
  }

};

Options.validateModulesOption = function (options, functionName, logger) {

  var err;

  if (_.isArray(options.modules) === false || options.modules.length === 0) {
    err = new errors.ConfigError('Please pass an array of folder / file paths for options.modules parameter to %s.', functionName);
    logger.error(err);
    logger.debug({}, "You may use 'some/dir/**/*.js' to include and '!some/dir/further/down/**/*.js' to exclude all JS files in a directory.");
    throw err;
  }

  for ( var i = 0; i < options.modules.length; i+=1 ) {
    if ((_.isString(options.modules[i]) === false || options.modules[i].length === 0) &&
        _.isPlainObject(options.modules[i]) === false) {
      err = new errors.ConfigError('Please pass a string (for paths) or an object (for custom modules) for element at index %d of options.modules to %s.', i, functionName);
      logger.error(err);
      throw err;
    }
  }

};

Options.validateUseOptions = function (options, functionName, logger) {

  var err;

  if (_.isUndefined(options.use)) {
    return;
  }

  if (_.isArray(options.use) === false) {
    err = new errors.ConfigError('Please pass an array of module names for the options.use parameter to %s.', functionName);
    logger.error(err);
    throw err;
  }

  for ( var i = 0; i < options.use.length; i+=1 ) {

    if (_.isString(options.use[i]) === false || options.use[i].length === 0) {
      err = new errors.ConfigError('Please pass a string for the element at index %d of options.use to %s.', i, functionName);
      logger.error(err);
      throw err;
    }

    if (descriptor.validateInterfaceName(options.use[i]) === false) {
      err = new errors.ConfigError('Please pass a valid interface name for the element at index %d of options.use to %s.', i, functionName);
      logger.error(err);
      logger.debug({}, 'A valid interface name must not contain whitespaces, stars, nor parenthesises.');
      throw err;
    }

    var parsedInterfaceName = descriptor.parseInterfaceName(options.use[i]);
    if (parsedInterfaceName.length === 1) {
      err = new errors.ConfigError('Please pass an interface name referencing an extended interface for the element at index %d of options.use to %s.', i, functionName);
      logger.error(err);
      logger.debug({}, 'options.use is designed to replace an implementation of an interface with a more specific one. E.g. for unit testing \'%s:mock\' would make sense.', parsedInterfaceName[0]);
      throw err;
    }

  }

};

Options.validateBustRequireCacheOption = function (options, functionName, logger) {

  var err;

  if (_.isUndefined(options.bustRequireCache)) {
    return;
  }

  if (_.isBoolean(options.bustRequireCache) === false) {
    err = new errors.ConfigError('Please pass a boolean for the options.bustRequireCache parameter to %s.', functionName);
    logger.error(err);
    throw err;
  }

};

Options.ensureImmutablePropertiesAreNotSet = function (options, functionName, logger) {

  var err;

  if (_.isUndefined(options.basePath) === false) {
    err = new errors.ConfigError("'options.basePath' cannot be set by passing it to %s. Please remove the property from the options you passed.", functionName);
    logger.error(err);
    logger.debug({}, "'options.basePath' must be provided when creating a new injector and is immutable for that injector.");
    throw err;
  }

  if (_.isUndefined(options.modules) === false) {
    err = new errors.ConfigError("'options.modules' cannot be set by passing it to %s. Please remove the property from the options you passed.", functionName);
    logger.error(err);
    logger.debug({}, "'options.modules' must be provided when creating a new injector and is immutable for that injector.");
    throw err;
  }

  if (_.isUndefined(options.bustRequireCache) === false) {
    err = new errors.ConfigError("'options.bustRequireCache' cannot be set by passing it to %s. Please remove the property from the options you passed.", functionName);
    logger.error(err);
    logger.debug({}, "'options.bustRequireCache' may be provided when creating a new injector and is immutable for that injector.");
    throw err;
  }

};


module.exports = Options;
