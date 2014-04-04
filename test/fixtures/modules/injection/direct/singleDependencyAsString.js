'use strict';

// Fire me up!

module.exports = function (singleAsString) {
  return [singleAsString];
};

module.exports.__module = {
  implements: 'injection/direct/singleDependencyAsString',
  inject: 'interfaces/unnested/singleAsString'
};
