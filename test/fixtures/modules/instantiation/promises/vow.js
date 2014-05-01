'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/promises/vow',
  inject: 'require(vow)',
  type: 'multiple instances'
};

module.exports.factory = function(vow, mode, id) {

  return new vow.Promise(function (resolve, reject) {

    if (mode === 1) {
      throw new Error(require('path').relative(process.cwd(), __filename) + '_' + id);
    }

    setTimeout(function () {
      if (mode === 0) {
        resolve(require('path').relative(process.cwd(), __filename) + '_' + id);
      } else if (mode === 2) {
        reject(require('path').relative(process.cwd(), __filename) + '_' + id);
      }
    }, 10);

  });

};
