// Initialize the engine
var engine = new PiEngine();
// Set up logging
var log = new Logger(false, LogLevel.TRACE);

// Entry point for the engine
$(document).ready(function() {
  var engineInput = $('#engineInput');
  var clearEngine = $('#clearEngine');
  var printEngine = $('#printEngine');
  var executeEngine = $('#executeEngine');
  var testEngine = $('#testEngine');

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

  executeEngine.mousedown(function() {
    log.debug('Executing...');
    engine.execute();
  });

  // Clears the Pi Engine
  clearEngine.mousedown(function() {
    log.debug('Clearing...');
    engine = new PiEngine();
  });

  // Prints the state of the Pi Engine
  printEngine.mousedown(function() {
    log.debug(engine.toString());
  });

  // Runs the engine test
  testEngine.mousedown(function() {
    new TestRunner();
    engine = new PiEngine();
  });
});


/**
 * A wrapper for handling errors that occur
 *
 * @param {string} message
 */
function handleError(message) {
  log.warn(message);
}
