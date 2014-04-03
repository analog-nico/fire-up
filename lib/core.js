'use strict';

var Promise = require('bluebird');


function createNewInjector(options, fireUpLib) {

  var fireUp = function (moduleName) {
    return Promise.reject(new Error('Not implemented yet.'));
  };

  fireUp.constants = fireUpLib.constants;
  fireUp.errors = fireUpLib.errors;

  fireUp._internal = {};

  return fireUp;
}


module.exports = {
  createNewInjector: createNewInjector
};
