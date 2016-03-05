/**
 * A simple logger
 * @constructor
 */
function Logger() {
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
 * @param {String} message
 */
Logger.prototype.trace = function(message) {
    if (this.logLevel.TRACE >= window['log']) {
        console.log('TRACE: ' + message);
    }
};


/**
 * Logs a debug message
 * @param {String} message
 */
Logger.prototype.debug = function(message) {
    if (this.logLevel.DEBUG >= window['log']) {
        console.log('DEBUG: ' + message);
    }
};


/**
 * Logs an informational message
 * @param {String} message
 */
Logger.prototype.info = function(message) {
    if (this.logLevel.INFO >= window['log']) {
        console.log('INFO: ' + message);
    }
};


/**
 * Logs an error message
 * @param {String} message
 */
Logger.prototype.warn = function(message) {
    if (this.logLevel.WARN >= window['log']) {
        console.log('WARN: ' + message);
    }
};