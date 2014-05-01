'use strict';

var fireUpLib = require('../../../../../lib/index.js');

// Fire me up!

module.exports = {
  implements: 'injection/direct/takesStaticArgs',
  inject: ['interfaces/unnested/singleAsList'],
  type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES
};

module.exports.factory = function (singleAsList, arg) {
  return [singleAsList, arg];
};
