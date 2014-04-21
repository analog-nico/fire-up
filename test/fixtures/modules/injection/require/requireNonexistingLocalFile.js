'use strict';

// Fire me up!

module.exports = function (localFile) {
  return localFile;
};

module.exports.__module = {
  implements: 'injection/require/requireNonexistingLocalFile',
  inject: 'require(./localFileNonexisting.js)'
};
