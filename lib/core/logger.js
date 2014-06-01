'use strict';

var util = require('util');
var _ = require('lodash');


function newLogger() {

  function log(data, message) {
    var _data = util.inspect(data, { depth: null });
    if (_data === '{}') {
      process.stdout.write(message + '\n');
    } else {
      process.stdout.write(message + '\n' + _data + '\n');
    }
  }

  function logError(data, message) {
    if (data instanceof Error && _.isUndefined(message)) {
      logError({ err: data }, data.message);
      return;
    }
    var _data = Array.prototype.shift.call(arguments);
    var _message = util.format.apply(undefined, arguments);
    log(_data, util.format('\x1b[1;31mfireUp# ERROR %s\x1b[0;0m', _message));
  }

  function logWarning(data, message) {
    var _data = Array.prototype.shift.call(arguments);
    var _message = util.format.apply(undefined, arguments);
    log(_data, util.format('\x1b[1;33mfireUp# WARN  %s\x1b[0;0m', _message));
  }

  function logInfo(data, message) {
    var _data = Array.prototype.shift.call(arguments);
    var _message = util.format.apply(undefined, arguments);
    log(_data, util.format('fireUp# INFO  %s', _message));
  }

  function logDebug(data, message) {
    var _data = Array.prototype.shift.call(arguments);
    var _message = util.format.apply(undefined, arguments);
    log(_data, util.format('\x1b[1;34mfireUp# DEBUG %s\x1b[0;0m', _message));
  }

  return {
    error: logError,
    warn: logWarning,
    info: logInfo,
    debug: logDebug
  };

}

module.exports = {
  newLogger: newLogger
};
