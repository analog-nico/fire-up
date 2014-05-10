'use strict';

// Fire me up!

module.exports = {
  implements: 'wrongConfig/invalidStarPatternReference',
  inject: 'test:*(not supported)'
};

module.exports.factory = function () { };
