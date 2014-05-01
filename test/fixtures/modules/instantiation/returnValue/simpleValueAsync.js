'use strict';

// Fire me up!

var Promise = require('bluebird');

module.exports = {
  implements: 'instantiation/returnValue/simpleValueAsync',
  type: 'multiple instances'
};

module.exports.factory = function () {

  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(require('path').relative(process.cwd(), __filename));
    }, 10);
  });

};
