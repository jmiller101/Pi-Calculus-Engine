/**
 * Holds the current state of the engine and processes the input
 *
 * @constructor
 */
function PiEngine() {
    this.inputs = [];
    this.processGroupsAndAgents = [];
}

/**
 * Processes a valid input
 *
 * @param {EngineInput} input
 */
PiEngine.prototype.processInput = function(input) {
    if (!input.isValid) {
        log.error('Invalid input was passed to PiEngine');
    }
    var inputString = input.input;

    if (inputString.indexOf('=') > -1) {
        var newAgent = new Agent(inputString);
        if (!!newAgent) {
            this.inputs.push(inputString);
        }
    } else {
        var newProcesses = new ProcessGroup(inputString);
    }
};

/**
 * Prints the state of the engine
 */
PiEngine.prototype.printState = function() {
    this.inputs.forEach(function(element, index, array) {
        log.info(element);
    });
};
