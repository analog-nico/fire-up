'use strict';

var _ = require('lodash');

var descriptor = require('./descriptor.js');
var constants = require('../definitions/constants.js');


function validateModule(fireUp, module, registryId) {

  var err, i;

  if (_.isPlainObject(module) === false) {
    err = new fireUp.errors.ConfigError("The following module does not export an object: %s", registryId);
    fireUp.log.error(err);
    fireUp.log.debug({}, "At minimum the following statement is required: module.exports = { implements: '<module interface>', factory: <function> };");
    throw err;
  }

  if (_.isUndefined(module.implements)) {
    err = new fireUp.errors.ConfigError("The following module does not export the exports.implements property: %s", registryId);
    fireUp.log.error(err);
    fireUp.log.debug({}, "You may assign a string denoting the interface implemented by the module or an array of strings for multiple interfaces.");
    throw err;
  } else if (_.isString(module.implements) === false && _.isArray(module.implements) === false) {
    err = new fireUp.errors.ConfigError("The following module exports the exports.implements property in the wrong format: %s", registryId);
    fireUp.log.error(err);
    fireUp.log.debug({}, "You may assign a string denoting the interface implemented by the module or an array of strings for multiple interfaces.");
    throw err;
  }

  function validateModuleImplementsEntry(entry, i, registryId) {
    if (_.isString(entry) === false || entry.length === 0 || descriptor.validateInterfaceName(entry) === false) {
      var err = new fireUp.errors.ConfigError("The following module exports an invalid interface name " + (i ? "at index " + i + " of" : "through") + " the exports.implements property: %s", registryId);
      fireUp.log.error(err);
      fireUp.log.debug({}, 'A valid interface name must not contain whitespaces, stars, nor parenthesises.');
      throw err;
    }
  }

  if (_.isArray(module.implements)) {

    for ( i = 0; i < module.implements.length; i+=1 ) {
      validateModuleImplementsEntry(module.implements[i], i, registryId);
    }

    if (_.uniq(module.implements).length < module.implements.length) {
      err = new fireUp.errors.ConfigError("The following module exports duplicated interface names in the exports.implements property: %s", registryId);
      fireUp.log.error(err);
      throw err;
    }

  } else {
    validateModuleImplementsEntry(module.implements, null, registryId);
  }

  function validateModuleInjectEntry(entry, i, registryId) {
    if (_.isString(entry) === false || entry.length === 0 || descriptor.validateModuleReference(entry) === false) {
      var err = new fireUp.errors.ConfigError("The following module exports an invalid module reference " + (i ? "at index " + i + " of" : "through") + " the exports.inject property: %s", registryId);
      fireUp.log.error(err);
      fireUp.log.debug({}, 'A valid module reference must not contain whitespaces and use parenthesises only at the end.');
      if (entry.match(/\*/)) {
        fireUp.log.debug({}, "The star selector is only available as a ':*' suffix.");
      }
      throw err;
    }
  }

  if (_.isUndefined(module.inject) === false) {

    if (_.isString(module.inject) === false && _.isArray(module.inject) === false) {
      err = new fireUp.errors.ConfigError("The following module exports the exports.inject property in the wrong format: %s", registryId);
      fireUp.log.error(err);
      fireUp.log.debug({}, "You should assign an array of strings that reference the interfaces for which an implementation shall be injected.");
      throw err;
    }

    if (_.isArray(module.inject)) {
      for ( i = 0; i < module.inject.length; i+=1 ) {
        validateModuleInjectEntry(module.inject[i], i, registryId);
      }
    } else {
      validateModuleInjectEntry(module.inject, null, registryId);
    }

    var injectedOwnInterfaces = _.intersection(
      _.isArray(module.implements) ? module.implements : [module.implements],
      _.isArray(module.inject) ? module.inject : [module.inject]
    );
    if (injectedOwnInterfaces.length > 0) {
      err = new fireUp.errors.ConfigError("The following module get one or more of its own interfaces injected: %s", registryId);
      fireUp.log.error(err);
      fireUp.log.debug({ injectedOwnInterfaces: injectedOwnInterfaces }, "Please make sure that exports.implements and exports.inject are distinct.");
      throw err;
    }

  }

  if (_.isUndefined(module.type) === false) {

    if (_.isString(module.type) === false ||
      (module.type !== fireUp.constants.MODULE_TYPE_SINGLETON && module.type !== fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES)) {
      err = new fireUp.errors.ConfigError("The following module exports an invalid module type through the exports.type property: %s", registryId);
      fireUp.log.error(err);
      fireUp.log.debug({}, "Please use either '%s' (default) or '%s'.", fireUp.constants.MODULE_TYPE_SINGLETON, fireUp.constants.MODULE_TYPE_MULTIPLE_INSTANCES);
      throw err;
    }

  }

  if (_.isUndefined(module.factory) && _.isUndefined(module._constructor) && _.isUndefined(module.instance)) {
    err = new fireUp.errors.ConfigError("The following module did not export any of the properties exports.factory, exports._constructor, or exports.instance: %s", registryId);
    fireUp.log.error(err);
    fireUp.log.debug({}, "For full flexibility it is recommended to use exports.factory.");
    throw err;
  }

  if ((_.isUndefined(module.factory) === false && _.isUndefined(module.instance) === false) ||
      (_.isUndefined(module.factory) === false && _.isUndefined(module._constructor) === false) ||
      (_.isUndefined(module.instance) === false && _.isUndefined(module._constructor) === false)) {
    err = new fireUp.errors.ConfigError("The following module exports more than one of the properties exports.factory, exports._constructor, and exports.instance: %s", registryId);
    fireUp.log.error(err);
    fireUp.log.debug({}, "Please define only one of those properties.");
    throw err;
  }

  if (_.isUndefined(module.instance) === false) {

    var isThenable = false;

    try {
      isThenable = _.isFunction(module.instance.then);
    } catch (e) { }

    if (isThenable) {
      err = new fireUp.errors.ConfigError("The following module exports a Thenable through the exports.instance property: %s", registryId);
      fireUp.log.error(err);
      fireUp.log.debug({}, "This is currently not supported. Open an issue on GitHub if that would be helpful to you.");
      throw err;
    }

  }

  if (_.isUndefined(module._constructor) === false) {

    if (_.isFunction(module._constructor) === false) {
      err = new fireUp.errors.ConfigError("The following module exports a value through the exports._constructor property that is not a function: %s", registryId);
      fireUp.log.error(err);
      throw err;
    }

  }

  if (_.isUndefined(module.factory) === false) {

    if (_.isFunction(module.factory) === false) {
      err = new fireUp.errors.ConfigError("The following module exports a value through the exports.factory property that is not a function: %s", registryId);
      fireUp.log.error(err);
      throw err;
    }

  }

}

function instanceToFactoryAdapter() {
  /* jshint validthis: true */
  if (this.type === constants.MODULE_TYPE_MULTIPLE_INSTANCES) {
    return _.cloneDeep(this.instance);
  } else {
    return this.instance;
  }
}

function constructorToFactoryAdapter() {
  /* jshint validthis: true */
  var obj = Object.create(this._constructor.prototype);
  this._constructor.apply(obj, arguments);
  return obj;
}

function addFactoryAdapterIfNeeded(module) {

  if (_.isUndefined(module.instance) === false) {

    module.factory = instanceToFactoryAdapter;

  } else if (_.isUndefined(module._constructor) === false) {

    module.factory = constructorToFactoryAdapter;

  }

  return module;

}

module.exports = {
  validateModule: validateModule,
  addFactoryAdapterIfNeeded: addFactoryAdapterIfNeeded
};
