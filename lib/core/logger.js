'use strict';

function newLogger(fireUp) {

  function log(message) {
    process.stdout.write(fireUp.constants.LOG_PREFIX + message + '\n');
  }

  function logError(message) {
    if (fireUp._internal.logLevel < fireUp.constants.LOG_LEVEL_ERROR) {
      return;
    }
    log('\x1b[1;31m' + 'ERROR ' + message + '\x1b[0;0m');
    if (message instanceof Error && message.stack) {
      logInfo(message.stack);
    }
  }

  function logWarning(message) {
    if (fireUp._internal.logLevel < fireUp.constants.LOG_LEVEL_WARNING) {
      return;
    }
    log('\x1b[1;33m' + 'WARN  ' + message + '\x1b[0;0m');
  }

  function logInfo(message) {
    if (fireUp._internal.logLevel < fireUp.constants.LOG_LEVEL_WARNING) {
      return;
    }
    log('INFO  ' + message);
  }

  function logDebug(message) {
    if (fireUp._internal.logLevel < fireUp.constants.LOG_LEVEL_WARNING) {
      return;
    }
    log('\x1b[1;34m' + 'DEBUG ' + message + '\x1b[0;0m');
  }

  function logTrace(message) {
    if (fireUp._internal.logLevel < fireUp.constants.LOG_LEVEL_WARNING) {
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
