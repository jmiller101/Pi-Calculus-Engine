// Initialize the engine
var engine = new PiEngine();
// Set up logging
var log = new Logger();
window['LOG_LEVEL'] = log.logLevel.DEBUG;

// Entry point for the engine
$(document).ready(function() {
    var engineInput = $('#engineInput');
    var clearEngine = $('#clearEngine');
    var printEngine = $('#printEngine');

    // Entry point for the Pi Engine
    engineInput.keydown(function(e) {
        var key = e.keyCode || e.which;

        if (key == 13) {
            e.preventDefault();
            var input = new EngineInput(engineInput.val());

            if (input.isValid) {
                engine.processInput(input);
                engineInput.val('');
            } else {
                handleError('Input was invalid!');
            }
        }
    });

    // Clears the Pi Engine
    clearEngine.mousedown(function() {
        log.debug('Clearing...');
        engine = new PiEngine();
    });

    // Prints the state of the Pi Engine
    printEngine.mousedown(function() {
        log.debug('Printing...');
        engine.printState();
    });
});

/**
 * A wrapper for handling errors that occur
 *
 * @param {String} message
 */
function handleError(message) {
    log.warn(message);
}
