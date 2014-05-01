'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/promises/mpromise',
  inject: 'require(mpromise)',
  type: 'multiple instances'
};

module.exports.factory = function(Promise, mode, id) {

  var promise = new Promise();

  setTimeout(function () {
    if (mode === 0) {
      promise.fulfill(require('path').relative(process.cwd(), __filename) + '_' + id);
    } else if (mode === 2) {
      promise.reject(require('path').relative(process.cwd(), __filename) + '_' + id);
    }
  }, 10);

  return promise;

};
