


/**
 * Holds the current state of the engine and processes the input
 *
 * @constructor
 */
function PiEngine() {
  this.inputs = [];
  this.agents = {};
  this.processGroups = [];

  this.channels = {};
  this.variables = {};
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
      this.agents[newAgent.agentName] = newAgent.processes;
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
 * Adds a channel to the engine. If the channel already exists, adds the new
 * content
 *
 * @param {Channel} channel
 */
PiEngine.prototype.addChannel = function(channel) {
  if (!!this.channels[channel.channelName]) {
    this.channels[channel.channelName].content.push(channel.content);
  } else {
    this.channels[channel.channelName] = channel;
  }
};


/**
 *
 * @param {string} variableName
 * @param {string} channelName
 */
PiEngine.prototype.addVariable = function(variableName, channelName) {

};


/**
 * @this {PiEngine}
 * @return {string}
 */
PiEngine.prototype.toString = function() {
  var engineString = 'PiEngine:\n';

  if (!jQuery.isEmptyObject(this.agents)) {
    engineString = engineString + '\nAgents ->\n';
  }
  var agentKeys = Object.keys(this.agents);
  for (var i = 0; i < agentKeys.length; i++) {
    var agentName = agentKeys[i];
    engineString = engineString + 'Agent name: \'' + agentName + '\' ->\n';
    engineString = engineString + this.agents[agentName].toString() + '\n';
  }

  if (this.processGroups.length > 0) {
    engineString = engineString + '\nProcessGroups ->\n';
  }
  for (var j = 0; j < this.processGroups.length; j++) {
    engineString = engineString + this.processGroups[j].toString() + '\n';
  }

  return engineString;
};
