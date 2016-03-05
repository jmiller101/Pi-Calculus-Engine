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
}

/**
 *
 * @param processesString
 * @constructor
 */
function ProcessGroup(processesString) {
    this.indeterminate = [];
    this.sum = [];
    this.sequential = [];
}

/**
 *
 * @param processString
 * @constructor
 */
function Process(processString) {
    this.process = processString;
}
