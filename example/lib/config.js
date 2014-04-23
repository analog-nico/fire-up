'use strict';

// Fire me up!

module.exports = function (logger) {

  return function (app) {
    app.use(logger());
    // ... and more config / adding middleware etc.
  };

};

module.exports.__module = {
  implements: 'config',
  inject: ['require(morgan)']
};
