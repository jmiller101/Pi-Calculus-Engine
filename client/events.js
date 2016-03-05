var engine = new PiEngine();
var logger = new Logger();
window['log'] = logger.logLevel.DEBUG;

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
            }
        }
    });

    // Clears the Pi Engine
    clearEngine.mousedown(function() {
        logger.debug('Clearing...');
        engine = new PiEngine();
    });

    // Prints the state of the Pi Engine
    printEngine.mousedown(function() {
        logger.debug('Printing...');
        engine.print();
    });
});
