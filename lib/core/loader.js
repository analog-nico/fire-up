'use strict';

var _ = require('lodash');
var Promise = require('bluebird');


function newLoader(_fireUp) {

  var fireUp = _fireUp;

  function validateUseOptions(useOptions) {
    return true;
  }

  function registerModules(options) {

    var useOptions = {};
    if (options && options.use) {
      useOptions = options.use;
    }

    if (validateUseOptions(useOptions)) {
      fireUp._internal.use = useOptions;
    }

    fireUp._internal.registry = {};

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
