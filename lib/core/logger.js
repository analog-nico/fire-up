'use strict';

var util = require('util');


function newLogger() {

  function logError(data, message) {
    var _data = util.inspect(Array.prototype.shift.call(arguments), { showHidden: true, depth: null });
    var _message = util.format.apply(undefined, arguments);
    if (_data === '{}') {
      process.stdout.write(util.format('\x1b[1;31mfireUp# ERROR %s\x1b[0;0m\n', _message));
    } else {
      process.stdout.write(util.format('\x1b[1;31mfireUp# ERROR %s\x1b[0;0m\n%s\n', _message, _data));
    }
  }

  function logWarning(data, message) {
    var _data = util.inspect(Array.prototype.shift.call(arguments), { showHidden: true, depth: null });
    var _message = util.format.apply(undefined, arguments);
    if (_data === '{}') {
      process.stdout.write(util.format('\x1b[1;33mfireUp# WARN  %s\x1b[0;0m\n', _message));
    } else {
      process.stdout.write(util.format('\x1b[1;33mfireUp# WARN  %s\x1b[0;0m\n%s\n', _message, _data));
    }
  }

  function logInfo(data, message) {
    var _data = util.inspect(Array.prototype.shift.call(arguments), { showHidden: true, depth: null });
    var _message = util.format.apply(undefined, arguments);
    if (_data === '{}') {
      process.stdout.write(util.format('fireUp# INFO  %s\n', _message));
    } else {
      process.stdout.write(util.format('fireUp# INFO  %s\n%s\n', _message, _data));
    }
  }

  function logDebug(data, message) {
    var _data = util.inspect(Array.prototype.shift.call(arguments), { showHidden: true, depth: null });
    var _message = util.format.apply(undefined, arguments);
    if (_data === '{}') {
      process.stdout.write(util.format('\x1b[1;34mfireUp# DEBUG %s\x1b[0;0m\n', _message));
    } else {
      process.stdout.write(util.format('\x1b[1;34mfireUp# DEBUG %s\x1b[0;0m\n%s\n', _message, _data));
    }
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
