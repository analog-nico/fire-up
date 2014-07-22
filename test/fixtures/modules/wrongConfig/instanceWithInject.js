'use strict';

// Fire me up!

module.exports = {
  implements: 'wrongConfig/instanceWithInject',
  inject: 'notAllowed'
};

module.exports.instance = { };
