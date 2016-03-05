/**
 * A simple logger
 *
 * @param {boolean} verbose Whether the user wants verbose output
 * @constructor
 */
function Logger(verbose) {
    this.verbose = verbose;

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
 * @type {{TRACE: number, DEBUG: number, INFO: number, WARN: number, OFF: number}}
 */
Logger.prototype.logLevel = {
    TRACE: 1,
    DEBUG: 2,
    INFO: 3,
    WARN: 4,
    OFF: 5
};

/**
 * Logs a trace message
 *
 * @param {string} message
 */
Logger.prototype.trace = function(message) {
    if (this.logLevel.TRACE >= window['LOG_LEVEL']) {
        this.doLog('TRACE', arguments.callee.caller.toString(), message);
    }
};


/**
 * Logs a debug message
 *
 * @param {string} message
 */
Logger.prototype.debug = function(message) {
    if (this.logLevel.DEBUG >= window['LOG_LEVEL']) {
        this.doLog('DEBUG', arguments.callee.caller.toString(), message);
    }
};


/**
 * Logs an informational message
 *
 * @param {string} message
 */
Logger.prototype.info = function(message) {
    if (this.logLevel.INFO >= window['LOG_LEVEL']) {
        this.doLog('INFO', arguments.callee.caller.toString(), message);
    }
};


/**
 * Logs an error message
 *
 * @param {string} message
 */
Logger.prototype.warn = function(message) {
    if (this.logLevel.WARN >= window['LOG_LEVEL']) {
        this.doLog('WARN', arguments.callee.caller.toString(), message);
    }
};