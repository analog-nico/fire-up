'use strict';

// Fire me up!

var Promise = require('bluebird');

module.exports = function () {

  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ path: require('path').relative(process.cwd(), __filename) });
    }, 10);
  });

};

module.exports.__module = {
  implements: 'instantiation/returnValue/objectAsync',
  type: 'multiple instances'
};
