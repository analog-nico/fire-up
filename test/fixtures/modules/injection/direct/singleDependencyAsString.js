'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/direct/singleDependencyAsString',
  inject: 'interfaces/unnested/singleAsString'
};

module.exports.factory = function (singleAsString) {
  return [singleAsString];
};
