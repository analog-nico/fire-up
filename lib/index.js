'use strict';

var core = require('./core/core.js');


var fireUpLib = {

  newInjector: function (options) {
    return core.createNewInjector(options);
  },

  constants: require('./definitions/constants.js'),
  errors: require('./definitions/errors.js')

};

module.exports = fireUpLib;
