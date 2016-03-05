/**
 *
 * @constructor
 */
function PiEngine() {
    this.inputs = [];
}

/**
 *
 * @param {EngineInput} input
 */
PiEngine.prototype.processInput = function(input) {
    this.inputs.push(input);
};

PiEngine.prototype.print = function() {

};
