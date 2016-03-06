


/**
 * Holds an agent
 *
 * @param {string} agentString
 * @constructor
 */
function Agent(agentString) {
  var strings = agentString.split(/=/);
  this.agentName = strings[0].trim();
  this.processes = new ProcessGroup(strings[1].trim());
  this.isValid = this.processes.isValid;
  log.debug(this.toString());
}


/**
 * @this {Agent}
 * @return {string}
 */
Agent.prototype.toString = function() {
  var agentString = 'Agent name: \'' + this.agentName + '\' ->\n';
  return agentString + this.processes.toString();
};



/**
 * Holds a group of related processes
 *
 * @param {string} processesString
 * @constructor
 */
function ProcessGroup(processesString) {
  this.indeterminates = [];
  this.isValid = true;

  /**
   * Sets all of the processes in the input string
   *
   * @this {ProcessGroup}
   */
  this.setProcesses = function() {
    var indeterminateStrings = processesString.split('\+');
    for (var i = 0; i < indeterminateStrings.length; i++) {
      var parallelList = this.setParallel(indeterminateStrings[i]);
      this.indeterminates.push(parallelList);
    }
    log.debug(this.toString());
  };

  /**
   * Gets a list of parallel processes from each indeterminate process
   *
   * @param {string} indeterminateString
   * @this {ProcessGroup}
   * @return {Process[][]} A list of parallel processes
   */
  this.setParallel = function(indeterminateString) {
    var parallelStrings = indeterminateString.trim().split('\|');
    var parallelList = [];

    for (var i = 0; i < parallelStrings.length; i++) {
      var sequentialList = this.setSequential(parallelStrings[i]);
      parallelList.push(sequentialList);
    }

    return parallelList;
  };

  /**
   * Gets a list of sequential processes from each parallel process
   *
   * @param {string} parallelString The parallel process string
   * @this {ProcessGroup}
   * @return {Process[]}
   */
  this.setSequential = function(parallelString) {
    var sequentialStrings = parallelString.trim().split('\.');
    var sequentialList = [];

    for (var i = 0; i < sequentialStrings.length; i++) {
      var processString = sequentialStrings[i].trim();
      log.info('Process string found: \'' + processString + '\'');
      var process = new Process(processString);
      if (process.isValid) {
        sequentialList.push(process);
      } else {
        this.isValid = false;
        log.warn('Invalid process: \'' + processString + '\'');
      }
    }

    return sequentialList;
  };

  this.setProcesses();
}


/**
 * @this {ProcessGroup}
 * @return {string}
 */
ProcessGroup.prototype.toString = function() {
  var groupString = '';
  for (var i = 0; i < this.indeterminates.length; i++) {
    var parallels = this.indeterminates[i];
    groupString = groupString + 'Indeterminate[' + i + ']:\n';
    for (var j = 0; j < parallels.length; j++) {
      var sequentials = parallels[j];
      groupString = groupString + '\t\t\tParallel[' + j + ']:\n';
      for (var k = 0; k < sequentials.length; k++) {
        groupString = groupString + '\t\t\t\tSequential[' + k + ']: \'' +
            sequentials[k].process + '\'\n';
      }
    }
  }
  return groupString;
};
