/**
 * Initializes and executes a process
 *
 * The init methods are run at the time that a new process string is read for
 * the user
 *
 * The do methods are run at the time that a use presses 'execute' on the web
 * page
 *
 * @param {string} processString
 * @constructor
 */
function Process(processString) {
  this.process = processString;
  this.isValid = true;
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
    this.content['variable'] = [];

    var readStrings = processString.split(/\?/);
    this.content['channel'] = readStrings[0].trim();

    if (readStrings[1].indexOf('(') > -1) {
      var thingsToWrite = this.getParenthesesValue(readStrings[1].trim())
          .split(/,/);
      for (var i = 0; i < thingsToWrite.length; i++) {
        if (checkString(thingsToWrite[i])) {
          this.content['variable'].push(thingsToWrite[i]);
        } else {
          engine.addError('Found invalid value in read');
        }
      }
    } else {
      this.content['variable'].push(readStrings[1].trim());
    }
  };

  this.doRead = function() {
    var channel = engine.channels[this.content['channel']];
    if (!!channel) {
      for (var i = 0; i < this.content['variable'].length; i++) {
        var readValue = channel.read();
        var variable = new Variable(this.content['variable'][i]);
        log.output('Reading \'' + readValue + '\' from channel ' +
            channel.channelName + ' to variable ' + variable.variableName);
        variable.content = readValue;
        engine.addVariable(variable);
      }
    } else {
      engine.addError('Cannot write to uninitialized channel: ' +
          this.content['channel']);
    }
  };

  this.initWrite = function() {
    this.type = ProcessType.WRITE;
    this.content['value'] = [];

    var writeStrings = processString.split(/!/);
    this.content['channel'] = writeStrings[0].trim();
    if (writeStrings[1].indexOf('(') > -1) {
      var thingsToWrite = this.getParenthesesValue(writeStrings[1].trim())
          .split(/,/);
      for (var i = 0; i < thingsToWrite.length; i++) {
        if (checkString(thingsToWrite[i])) {
          log.debug('Preparing to write [' + thingsToWrite[i] + ']');
          this.content['value'].push(thingsToWrite[i]);
        } else {
          engine.addError('Found invalid value in write');
        }
      }
    } else {
      var valueToWrite = writeStrings[1].trim();
      log.debug('Preparing to write \'' + valueToWrite + '\'');
      this.content['value'].push(valueToWrite);
    }
  };

  this.doWrite = function() {
    var channel = engine.channels[this.content['channel']];
    if (!!channel) {
      for (var i = 0; i < this.content['value'].length; i++) {
        if (this.content['value'][i].indexOf('\'') > -1) {
          log.output('Writing ' + this.content['value'][i] + ' to the ' +
              'channel ' + channel.channelName);
          channel.write(this.content['value'][i]);
        } else {
          var variable = engine.variables[this.content['value'][i]];
          if (!!variable) {
            log.output('Writing \'' + variable.content + '\' to the channel ' +
                channel.channelName);
            channel.write(variable.content);
          } else {
            engine.addError('Cannot output from uninitialized variable: ' +
                this.content['value'][i]);
          }
        }
      }
    } else {
      engine.addError('Channel \'' + this.content['channel'] + '\' has not ' +
          'been initialized');
    }
  };

  this.initPrint = function() {
    this.type = ProcessType.PRINT;
    this.content['toPrint'] = [];

    var thingsToPrint = this.getParenthesesValue(processString).split(/,/);
    for (var i = 0; i < thingsToPrint.length; i++) {
      if (checkString(thingsToPrint[i])) {
        log.debug('Adding \'' + thingsToPrint[i] + '\' to print later');
        this.content['toPrint'].push(thingsToPrint[i]);
      } else {
        engine.addError(thingsToPrint[i] + ' cannot be printed');
      }
    }
  };

  this.doPrint = function() {
    for (var i = 0; i < this.content['toPrint'].length; i++) {
      var string = this.content['toPrint'][i];
      var typeToPrint = '';
      var valueToPrint = '';
      if (string.indexOf('\'') > -1) {
        log.debug('Full value: ' + string);
        valueToPrint = this.getQuoteValue(string);
        log.debug('Trimmed: ' + valueToPrint);
        typeToPrint = 'Input string';
      } else {
        log.debug('Full value: ' + engine.variables[string].content);
        valueToPrint = this.getQuoteValue(engine.variables[string].content);
        log.debug('Trimmed: ' + valueToPrint);
        typeToPrint = 'Variable string';
      }
      if (!!valueToPrint) {
        engine.addOutput(valueToPrint);
      } else {
        engine.addError('There are no values to print from ' + string);
      }
    }
  };

  this.initChannel = function() {
    this.type = ProcessType.CHANNEL;
    this.content['channels'] = [];

    var channelsToMake = this.getParenthesesValue(processString).split(/,/);
    for (var i = 0; i < channelsToMake.length; i++) {
      if (checkString(channelsToMake[i])) {
        this.content['channels'].push(channelsToMake[i]);
      } else {
        engine.addError('Channel was invalid: ' + channelsToMake[i]);
      }
    }
  };

  this.doChannel = function() {
    for (var i = 0; i < this.content['channels'].length; i++) {
      var newChannel = new Channel(this.content['channels'][i]);
      log.output('Created new channel ' + newChannel.channelName);
      engine.addChannel(newChannel);
    }
  };

  this.initAgent = function() {
    this.type = ProcessType.AGENT;
    this.content['agent'] = processString.trim();
  };

  this.doAgent = function() {
    var agent = engine.agents[this.content['agent']];
    if (!!agent) {
      log.output('Processing agent ' + agent.agentName);
      agent.processes.doProcesses();
    } else {
      engine.addError('Agent \'' + this.content['agent'] + '\' has not been ' +
          'initialized');
    }
  };

  /**
   * Utility function to get a value from between parentheses
   *
   * @param {string} parenthesesString
   * @return {?string}
   */
  this.getParenthesesValue = function(parenthesesString) {
    var betweenParentheses = /\(([^)]+)\)/;
    var string = betweenParentheses.exec(parenthesesString);
    if (!!string) {
      return string[1];
    }
    return '';
  };

  /**
   * Utility function to get a value from between quotes
   *
   * @param {string} quotesString
   * @return {?string}
   */
  this.getQuoteValue = function(quotesString) {
    var betweenParentheses = /'([^']+)'/;
    var string = betweenParentheses.exec(quotesString);
    if (!!string) {
      return string[1];
    }
    return null;
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
 * Executes the process according to the type of process that it is
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
  if (this.content.length > 0) {
    return this.content.shift();
  } else {
    return this.content;
  }
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
