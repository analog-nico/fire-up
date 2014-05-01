'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/requireLocalFile',
  inject: 'require(./localFile.js)'
};

module.exports.factory = function (localFile) {
  return localFile;
};
