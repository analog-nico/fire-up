'use strict';

// Fire me up!

module.exports = function(P, mode, id) {

  var def = P.defer();

  setTimeout(function () {
    if (mode === 0) {
      def.resolve(require('path').relative(process.cwd(), __filename) + '_' + id);
    } else if (mode === 2) {
      def.reject(require('path').relative(process.cwd(), __filename) + '_' + id);
    }
  }, 10);

  return def.promise;

};

module.exports.__module = {
  implements: 'instantiation/promises/p',
  inject: 'require(p-promise)',
  type: 'multiple instances'
};
