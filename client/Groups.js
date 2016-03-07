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

  this.doParallelProcesses = function(parallelProcessArray) {
    if (parallelProcessArray.length > 1) {
      var processOrder = this.getShuffledList(0, parallelProcessArray.length);
      for (var toProcess in processOrder) {
        this.doSequentialProcesses(parallelProcessArray[toProcess]);
      }
    } else if (parallelProcessArray.length > 0) {
      this.doSequentialProcesses(parallelProcessArray[0]);
    } else {
      handleError('Error executing process group: sequential process array ' +
          'is invalid');
    }
  };

  this.doSequentialProcesses = function(sequentialProcessArray) {
    for (var i = 0; i < sequentialProcessArray.length; i++) {
      sequentialProcessArray[i].doProcess();
    }
  };

  /**
   * Helper function to get a random number in a range
   *
   * @param {Number} min  Lower limit (inclusive)
   * @param {Number} max  Upper limit (exclusive)
   * @return {number}
   */
  this.getRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /**
   * Helper function to return a shuffled array of values in a range
   *
   * @param {Number} min  Lower limit (inclusive)
   * @param {Number} max  Upper limit (exclusive)
   * @this {ProcessGroup}
   * @return {Array}
   */
  this.getShuffledList = function(min, max) {
    var array = [];

    for (var i = min; i < max; i++) {
      array.push(i);
    }
    for (var j = 0; j < array.length; j++) {
      var place = this.getRandom(0, array.length);
      var temp = array[j];
      array[j] = array[place];
      array[place] = temp;
    }

    return array;
  };

  this.setProcesses();
}


/**
 * Executes a process group
 */
ProcessGroup.prototype.doProcesses = function() {
  if (this.indeterminates.length > 1) {
    var groupToProcess = this.getRandom(0, this.indeterminates.length);
    log.debug('Parallel group to process: ' + groupToProcess);
    this.doParallelProcesses(this.indeterminates[groupToProcess]);
  } else if (this.indeterminates.length > 0) {
    this.doParallelProcesses(this.indeterminates[0]);
  } else {
    handleError('Error executing process group: parallel process array is ' +
        'invalid');
  }
};


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
