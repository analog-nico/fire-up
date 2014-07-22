'use strict';

// Fire me up!

module.exports = {
  implements: 'wrongConfig/thenableInstance'
};

module.exports.instance = { then: function () {} };
