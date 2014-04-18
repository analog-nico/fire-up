'use strict';

// Fire me up!

module.exports = function () { };

module.exports.__module = {
  implements: 'wrongConfig/staticArgsForSingleton',
  inject: 'interfaces/unnested/singleAsString(not allowed)'
};
