'use strict';

// Fire me up!

module.exports = function (singleAsList) {
  return [singleAsList];
};

module.exports.__module = {
  implements: 'injection/direct/singleDependencyAsList',
  inject: ['interfaces/unnested/singleAsList']
};
