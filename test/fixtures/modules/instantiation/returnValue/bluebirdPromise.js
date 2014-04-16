'use strict';

// Fire me up!

module.exports = function(Promise, mode, id) {

  return new Promise(function (resolve, reject) {

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

module.exports.__module = {
  implements: 'instantiation/returnValue/bluebirdPromise',
  inject: 'require(bluebird)',
  type: 'multiple instances'
};
