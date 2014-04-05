'use strict';

module.exports = {
  LOG_LEVEL_ERROR: 1,
  LOG_LEVEL_WARNING: 2,
  LOG_LEVEL_INFO: 3,
  LOG_LEVEL_DEBUG: 4, // Default
  LOG_LEVEL_TRACE: 5,

  LOG_PREFIX: 'fireUp# ',

  FILE_STATUS_UNCHECKED: 'unchecked',
  FILE_STATUS_TO_IGNORE: 'to be ignored',
  FILE_STATUS_TO_LOAD: 'to be loaded',
  FILE_STATUS_LOADED: 'loaded',
  FILE_STATUS_INVALID: 'load failed',
  FILE_STATUS_REGISTERED: 'registered',

  MODULE_TYPE_SINGLETON: 'singleton', // Default
  MODULE_TYPE_MULTIPLE_INSTANCES: 'multiple instances'
};