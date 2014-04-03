'use strict';

var core = require('./core/core.js');
var constants = require('./definitions/constants.js');
var errors = require('./definitions/errors.js');


var fireUpLib = {

  newInjector: function (options) {
    return core.createNewInjector(options, fireUpLib);
  },

  constants: constants,
  errors: errors

};

module.exports = fireUpLib;
