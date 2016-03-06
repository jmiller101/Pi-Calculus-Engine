


/**
 * Holds a process
 *
 * @param {string} processString
 * @constructor
 */
function Process(processString) {
  this.process = processString;
  this.isValid = false;
  this.type = null;
  this.content = {};

  if (processString.indexOf('?') > -1) {
    this.type = 'read';
    var readStrings = processString.split(/\?/);
    this.content['channel'] = readStrings[0].trim();
    this.content['variable'] = readStrings[1].trim();

  } else if (processString.indexOf('!') > -1) {
    this.type = 'write';
    var writeStrings = processString.split(/!/);
    this.content['channel'] = writeStrings[0].trim();
    this.content['value'] = writeStrings[1].trim();
  } else if (processString.indexOf('print') > -1) {
    this.type = 'print';
    this.content['toPrint'] = [];
    var thingsToPrint = this.getParenthesesValues(processString).split(/,/);
    for (var string in thingsToPrint) {
      this.content['toPrint'].push(string);
    }
  } else if (processString.indexOf('new') > -1) {
    this.type = 'new';
    var channelsToMake = this.getParenthesesValues(processString).split(/,/);
    for (var channelString in channelsToMake) {
      engine.channels.push(new Channel(channelString));
    }
  } else {
    this.type = 'agent';
    this.content['agent'] = processString.trim();
  }

  /**
   * Utility function to get a value from between parentheses
   *
   * @param {string} parenthesesString
   * @return {Array|{index: number, input: string}}
   */
  this.getParenthesesValues = function(parenthesesString) {
    var betweenParens = /\(([^)]+)\)/;
    return betweenParens.exec(parenthesesString);
  };
}



/**
 * Holds a channel
 *
 * @param {string} channelName
 * @constructor
 */
function Channel(channelName) {
  this.channelName = channelName;
  this.content = [];
}


/**
 * Returns the earliest thing added to the content array
 *
 * @return {object}
 */
Channel.prototype.read = function() {
  return this.content.shift();
};


/**
 * Pushes a new piece of content into the channel
 *
 * @param {object} content
 * @return {Number}
 */
Channel.prototype.write = function(content) {
  return this.content.push(content);
};



/**
 * Holds a variable
 *
 * @param {string} variableName
 * @constructor
 */
function Variable(variableName) {
  this.variableName = variableName;
  this.content = null;
}
