'use strict';

// Fire me up!

var BPromise = require('bluebird');

module.exports = {
  implements: 'instantiation/returnValue/functionAsync',
  type: 'multiple instances'
};

module.exports.factory = function () {

  return new BPromise(function (resolve) {
    setTimeout(function () {
      resolve(function () {
        return require('path').relative(process.cwd(), __filename);
      });
    }, 10);
  });

};
