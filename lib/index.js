'use strict';

var core = require('./core.js');
var constants = require('./constants.js');
var errors = require('./errors.js');


var fireUpLib = {

  newInjector: function (options) {
    return core.createNewInjector(options, fireUpLib);
  },

  constants: constants,
  errors: errors

};

module.exports = fireUpLib;
