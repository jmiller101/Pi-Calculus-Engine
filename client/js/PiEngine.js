/**
 * Holds the current state of the engine and processes the input
 *
 * @constructor
 */
function PiEngine() {
  this.inputs = [];
  this.agents = {};
  this.processGroups = [];

  this.isExecuted = false;
  this.channels = {};
  this.variables = {};

  this.outputs = [];
  this.errors = [];
}


/**
 * Executes the engine based on what's been loaded
 */
PiEngine.prototype.execute = function() {
  if (this.processGroups.length > 0) {
    this.channels = {};
    this.variables = {};
    for (var i = 0; i < this.processGroups.length; i++) {
      this.processGroups[i].doProcesses();
    }
    this.isExecuted = true;
  } else {
    log.debug('There are no current processes');
  }
};


/**
 * Processes a valid input
 *
 * @param {EngineInput} input
 */
PiEngine.prototype.processInput = function(input) {
  if (!input.isValid) {
    log.warn('Invalid input was passed to PiEngine');
  }
  var inputString = input.input;

  if (inputString.indexOf('=') > -1) {
    log.debug('Making new agent');
    var newAgent = new Agent(inputString);
    if (!!newAgent && newAgent.isValid) {
      this.inputs.push(inputString);
      this.agents[newAgent.agentName] = newAgent;
    }
  } else {
    log.debug('Making new processGroup');
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
 * Adds a variable to the engine
 *
 * @param {Variable} variable
 */
PiEngine.prototype.addVariable = function(variable) {
  this.variables[variable.variableName] = variable;
};


/**
 * Adds a string to the output
 *
 * @param {string} output
 */
PiEngine.prototype.addOutput = function(output) {
  log.output(output);
  this.outputs.push(output);
};


/**
 * Gets all of the outputs in a single string
 *
 * @return {string}
 */
PiEngine.prototype.getOutput = function() {
  return this.outputs.join(',');
};


/**
 * Adds a string to the output
 *
 * @param {string} error
 */
PiEngine.prototype.addError = function(error) {
  log.warn(error);
  this.errors.push(error);
};


/**
 * Gets all of the outputs in a single string
 *
 * @return {string}
 */
PiEngine.prototype.getErrors = function() {
  return this.errors.join(',');
};


/**
 * @this {PiEngine}
 * @return {string}
 */
PiEngine.prototype.toString = function() {
  var engineString = [];
  engineString.push('State:\n');

  if (!jQuery.isEmptyObject(this.agents)) {
    engineString.push('\nAgents ->\n');
    var agentKeys = Object.keys(this.agents);
    for (var i = 0; i < agentKeys.length; i++) {
      engineString.push('Agent name: \'' + agentKeys[i] + '\' ->\n');
      engineString.push(this.agents[agentKeys[i]].toString() + '\n');
    }
  }

  if (this.processGroups.length > 0) {
    engineString.push('\nProcessGroups ->\n');
    for (var j = 0; j < this.processGroups.length; j++) {
      engineString.push(this.processGroups[j].toString() + '\n');
    }
  }

  if (this.isExecuted) {
    engineString.push('Executed:\n');
    if (!jQuery.isEmptyObject(this.channels)) {
      engineString.push('\nChannels ->\n');
      var channelKeys = Object.keys(this.channels);
      for (var k = 0; k < channelKeys.length; k++) {
        engineString.push(this.channels[channelKeys[k]].toString());
      }
    }

    if (!jQuery.isEmptyObject(this.variables)) {
      engineString.push('\nVariables ->\n');
      var variableKeys = Object.keys(this.variables);
      for (var l = 0; l < variableKeys.length; l++) {
        engineString.push(this.variables[variableKeys[l]].toString());
      }
    }
  }

  return engineString.join().replace(/,/g, '');
};
