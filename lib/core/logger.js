'use strict';

function newLogger(fireUp) {

  function log(message) {
    console.log(fireUp.constants.LOG_PREFIX);
  }

  function logErr(message) {
    console.error(fireUp.constants.LOG_PREFIX);
  }

  function logError(message) {
    if (fireUp._internal.logLevel > fireUp.constants.LOG_LEVEL_ERROR) {
      return;
    }
    logErr('ERROR ' + message);
  }

  function logWarning(message) {
    if (fireUp._internal.logLevel > fireUp.constants.LOG_LEVEL_WARNING) {
      return;
    }
    log('WARN  ' + message);
  }

  function logInfo(message) {
    if (fireUp._internal.logLevel > fireUp.constants.LOG_LEVEL_WARNING) {
      return;
    }
    log('INFO ' + message);
  }

  function logDebug(message) {
    if (fireUp._internal.logLevel > fireUp.constants.LOG_LEVEL_WARNING) {
      return;
    }
    log('DEBUG ' + message);
  }

  function logTrace(message) {
    if (fireUp._internal.logLevel > fireUp.constants.LOG_LEVEL_WARNING) {
      return;
    }
    log(message);
  }

  return {
    error: logError,
    warning: logWarning,
    info: logInfo,
    debug: logDebug,
    trace: logTrace
  };

}

module.exports = {
  newLogger: newLogger
};
