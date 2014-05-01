'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/promises/node-promise',
  inject: 'require(node-promise)',
  type: 'multiple instances'
};

module.exports.factory = function(nodePromise, mode, id) {

  var promise = new nodePromise.Promise();

  setTimeout(function () {
    if (mode === 0) {
      promise.resolve(require('path').relative(process.cwd(), __filename) + '_' + id);
    } else if (mode === 2) {
      promise.reject(require('path').relative(process.cwd(), __filename) + '_' + id);
    }
  }, 10);

  return promise;

};
