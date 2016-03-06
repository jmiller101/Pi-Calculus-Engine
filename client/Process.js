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

  this.initProcess = function() {
    if (processString.indexOf('?') > -1) {
      this.initRead();
    } else if (processString.indexOf('!') > -1) {
      this.initWrite();
    } else if (processString.indexOf('print') > -1) {
      this.initPrint();
    } else if (processString.indexOf('new') > -1) {
      this.initChannel();
    } else {
      this.initAgent();
    }
  };

  this.initRead = function() {
    this.type = ProcessType.READ;
    var readStrings = processString.split(/\?/);
    this.content['channel'] = readStrings[0].trim();
    this.content['variable'] = readStrings[1].trim();
  };

  this.doRead = function() {
    var engineVariable = engine.variables[this.content['variable']];
    var engineChannel = engine.channels[this.content['channel']];
    engineVariable.content = engineChannel.read();
  };

  this.initWrite = function() {
    this.type = ProcessType.WRITE;
    var writeStrings = processString.split(/!/);
    this.content['channel'] = writeStrings[0].trim();
    this.content['value'] = writeStrings[1].trim();
  };

  this.doWrite = function() {
    engine.channels[this.content['channel']].write(this.content['value']);
  };

  this.initPrint = function() {
    this.type = ProcessType.PRINT;
    this.content['toPrint'] = [];
    var thingsToPrint = this.getParenthesesValues(processString).split(/,/);
    for (var string in thingsToPrint) {
      if (checkString(string)) {
        this.content['toPrint'].push(string);
      }
    }
  };

  this.doPrint = function() {
    for (var string in this.content['toPrint']) {
      var typeToPrint = '';
      var valueToPrint = '';
      if (string.indexOf('\"') > -1) {
        valueToPrint = this.getQuoteValues(string);
        typeToPrint = 'Input string';
      } else {
        valueToPrint = engine.variables[string].content;
        typeToPrint = 'Variable string';
      }
      log.output(typeToPrint + ': ' + valueToPrint);
    }
  };

  this.initChannel = function() {
    this.type = ProcessType.CHANNEL;
    this.content['channels'] = [];
    var channelsToMake = this.getParenthesesValues(processString).split(/,/);
    for (var channelString in channelsToMake) {
      if (checkString(channelString)) {
        this.content['channels'].push(channelString);
      }
    }
  };

  this.doChannel = function() {
    for (var channel in this.content['channels']) {
      var newChannel = new Channel(channel);
      engine.addChannel(newChannel);
    }
  };

  this.initAgent = function() {
    this.type = ProcessType.AGENT;
    this.content['agent'] = processString.trim();
  };

  this.doAgent = function() {
    engine.agents[this.content['agent']].processes.doProcesses();
  };

  /**
   * Utility function to get a value from between parentheses
   *
   * @param {string} parenthesesString
   * @return {Array|{index: number, input: string}}
   */
  this.getParenthesesValues = function(parenthesesString) {
    var betweenParentheses = /\(([^)]+)\)/;
    return betweenParentheses.exec(parenthesesString);
  };

  /**
   * Utility function to get a value from between quotes
   *
   * @param {string} quotesString
   * @return {Array|{index: number, input: string}}
   */
  this.getQuoteValues = function(quotesString) {
    var betweenParentheses = /('|")([^"']+)('|")/;
    return betweenParentheses.exec(quotesString);
  };

  this.initProcess();
}


/**
 * An enum for the types of processes
 * @type {{READ: number, WRITE: number, PRINT: number, CHANNEL: number, AGENT: number}}
 */
ProcessType = {
  READ: 1,
  WRITE: 2,
  PRINT: 3,
  CHANNEL: 4,
  AGENT: 5
};


/**
 * Executes the process
 * @this {Process}
 */
Process.prototype.doProcess = function() {
  if (this.type == ProcessType.READ) {
    this.doRead();
  } else if (this.type == ProcessType.WRITE) {
    this.doWrite();
  } else if (this.type == ProcessType.PRINT) {
    this.doPrint();
  } else if (this.type == ProcessType.CHANNEL) {
    this.doChannel();
  } else if (this.type == ProcessType.AGENT) {
    this.doAgent();
  } else {
    handleError('Process doesn\'t have a valid type!');
  }
};



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
