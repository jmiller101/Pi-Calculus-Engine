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
 * @type {{TRACE: number, DEBUG: number, INFO: number, WARN: number, OFF: number, OUTPUT: number}}
 */
LogLevel = {
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  OFF: 5,
  OUTPUT: 6
};


/**
 * Logs a trace message
 *
 * @param {string} message
 * @this {Logger}
 */
Logger.prototype.trace = function(message) {
  if (LogLevel.TRACE >= this.logLevel) {
    this.doLog('TRACE', arguments.callee.caller.toString(), message);
  }
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
 * Logs an error message
 *
 * @param {string} message
 * @this {Logger}
 */
Logger.prototype.output = function(message) {
  if (LogLevel.OUTPUT >= this.logLevel) {
    this.doLog('OUTPUT', arguments.callee.caller.toString(), message);
  }
};
