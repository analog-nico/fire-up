'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/requireNonexistingLocalFile',
  inject: 'require(./localFileNonexisting.js)'
};

module.exports.factory = function (localFile) {
  return localFile;
};
