'use strict';

var fireUpLib = require('../../../../../lib/index.js');

// Fire me up!

module.exports = function (singleAsList, arg) {
  return [singleAsList, arg];
};

module.exports.__module = {
  implements: 'injection/direct/takesStaticArgs',
  inject: ['interfaces/unnested/singleAsList'],
  type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
