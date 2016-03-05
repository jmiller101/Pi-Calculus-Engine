


/**
 * Holds the current state of the engine and processes the input
 *
 * @constructor
 */
function PiEngine() {
  this.inputs = [];
  this.agents = [];
  this.processGroups = [];
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
    if (!!newAgent && newAgent.isValid) {
      this.inputs.push(inputString);
      this.agents.push(newAgent);
    }
  } else {
    var newProcesses = new ProcessGroup(inputString);
    if (!!newProcesses && newProcesses.isValid) {
      this.inputs.push(inputString);
      this.processGroups.push(newProcesses);
    }
  }
};


/**
 * @this {PiEngine}
 * @return {string}
 */
PiEngine.prototype.toString = function() {
  var engineString = 'PiEngine:\n';

  if (this.agents.length > 0) {
    engineString = engineString + '\nAgents ->\n';
  }
  for (var i = 0; i < this.agents.length; i++) {
    engineString = engineString + this.agents[i].toString() + '\n';
  }

  if (this.processGroups.length > 0) {
    engineString = engineString + '\nProcessGroups ->\n';
  }
  for (var j = 0; j < this.processGroups.length; j++) {
    engineString = engineString + this.processGroups[j].toString() + '\n';
  }

  return engineString;
};
