'use strict';

// Fire me up!

module.exports = {
  implements: 'wrongConfig/staticArgsForSingleton',
  inject: 'interfaces/unnested/singleAsString(not allowed)'
};

module.exports.factory = function () { };
