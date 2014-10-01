'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/requireIndexJsInFolder',
  inject: 'require(./)'
};

module.exports.factory = function (localFile) {
  return localFile;
};
