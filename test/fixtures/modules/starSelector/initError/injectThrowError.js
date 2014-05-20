'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/initError/injectThrowError',
  inject: 'starSelector/initError/throwError:*'
};

module.exports.factory = function (throwError) {
  return throwError;
};
