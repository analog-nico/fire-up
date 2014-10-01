'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/require/requireLocalFileWithoutExt',
  inject: 'require(./localFile)'
};

module.exports.factory = function (localFile) {
  return localFile;
};
