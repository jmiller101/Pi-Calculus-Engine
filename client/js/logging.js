/**
 * A simple logger
 *
 * @param {boolean} verbose   Whether the user wants verbose output
 * @param {number} logLevel The log level
 * @constructor
 */
function Logger(verbose, logLevel) {
  this.verbose = verbose;
  this.logLevel = logLevel;

  this.doLog = function(level, caller, message) {
    if (!!caller && this.verbose) {
      console.log(level + '-> ' + message + '-> ' + caller);
    } else {
      console.log(level + '-> ' + message);
    }
  };
}


/**
 * This enum defines the different levels of logging.
 * @type {{DEBUG: number, INFO: number, WARN: number, OUTPUT: number, TEST: number}}
 */
LogLevel = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  OUTPUT: 4,
  TEST: 5
};


/**
 * Logs a debug message
 *
 * @param {string} message
 * @this {Logger}
 */
Logger.prototype.debug = function(message) {
  if (LogLevel.DEBUG >= this.logLevel) {
    this.doLog('DEBUG', arguments.callee.caller.toString(), message);
  }
};


/**
 * Logs an informational message
 *
 * @param {string} message
 * @this {Logger}
 */
Logger.prototype.info = function(message) {
  if (LogLevel.INFO >= this.logLevel) {
    this.doLog('INFO', arguments.callee.caller.toString(), message);
  }
};


/**
 * Logs an error message
 *
 * @param {string} message
 * @this {Logger}
 */
Logger.prototype.warn = function(message) {
  if (LogLevel.WARN >= this.logLevel) {
    this.doLog('WARN', arguments.callee.caller.toString(), message);
  }
};


/**
 * Logs a program output message
 *
 * @param {string} message
 * @this {Logger}
 */
Logger.prototype.output = function(message) {
  if (LogLevel.OUTPUT >= this.logLevel) {
    this.doLog('\nOUTPUT', arguments.callee.caller.toString(),
        message + '\n\n');
  }
};


/**
 * Logs a test output message
 *
 * @param {string} message
 * @this {Logger}
 */
Logger.prototype.test = function(message) {
  if (LogLevel.TEST >= this.logLevel) {
    this.doLog('TEST', arguments.callee.caller.toString(), message);
  }
};
