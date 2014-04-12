'use strict';

function newLogger() {

  function log(message) {
    process.stdout.write('fireUp# ' + message + '\n');
  }

  function logError(message) {
    log('\x1b[1;31m' + 'ERROR ' + message + '\x1b[0;0m');
    if (message instanceof Error && message.stack) {
      logInfo(message.stack);
    }
  }

  function logWarning(message) {
    log('\x1b[1;33m' + 'WARN  ' + message + '\x1b[0;0m');
  }

  function logInfo(message) {
    log('INFO  ' + message);
  }

  function logDebug(message) {
    log('\x1b[1;34m' + 'DEBUG ' + message + '\x1b[0;0m');
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
