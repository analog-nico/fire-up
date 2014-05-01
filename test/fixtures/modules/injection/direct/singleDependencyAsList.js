'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/direct/singleDependencyAsList',
  inject: ['interfaces/unnested/singleAsList']
};

module.exports.factory = function (singleAsList) {
  return [singleAsList];
};
