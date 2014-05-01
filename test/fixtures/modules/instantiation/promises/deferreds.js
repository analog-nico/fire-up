'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/promises/deferreds',
  inject: 'require(deferreds/Deferred)',
  type: 'multiple instances'
};

module.exports.factory = function(Deferred, mode, id) {

  var def = new Deferred();

  setTimeout(function () {
    if (mode === 0) {
      def.resolve(require('path').relative(process.cwd(), __filename) + '_' + id);
    } else if (mode === 2) {
      def.reject(require('path').relative(process.cwd(), __filename) + '_' + id);
    }
  }, 10);

  return def.promise();

};
