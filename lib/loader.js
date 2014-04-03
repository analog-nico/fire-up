'use strict';

var _ = require('lodash');
var Promise = require('bluebird');


function newLoader(__internal) {

  var _internal = __internal;

  function validateUseOptions(useOptions) {
    return true;
  }

  function registerModules(options) {

    var useOptions = {};
    if (options && options.use) {
      useOptions = options.use;
    }

    if (validateUseOptions(useOptions)) {
      _internal.use = useOptions;
    }

    _internal.registry = {};

  }

  function loadModule(moduleName) {
    return Promise.reject(new Error('Not implemented yet.'));
  }

  return {
    registerModules: registerModules,
    loadModule: loadModule
  };

}


module.exports = {
  newLoader: newLoader
};
