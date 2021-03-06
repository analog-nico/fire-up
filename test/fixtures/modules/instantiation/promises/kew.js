'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/promises/kew',
  inject: 'require(kew)',
  type: 'multiple instances'
};

module.exports.factory = function(Q, mode, id) {

  var def = Q.defer();

  setTimeout(function () {
    if (mode === 0) {
      def.resolve(require('path').relative(process.cwd(), __filename) + '_' + id);
    } else if (mode === 2) {
      def.reject(require('path').relative(process.cwd(), __filename) + '_' + id);
    }
  }, 10);

  return def.promise;

};
