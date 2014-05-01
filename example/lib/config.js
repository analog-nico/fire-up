'use strict';

// Fire me up!

module.exports = {
  implements: 'config',
  inject: ['require(morgan)']
};

module.exports.factory = function (logger) {

  return function (app) {
    app.use(logger());
    // ... and more config / adding middleware etc.
  };

};
