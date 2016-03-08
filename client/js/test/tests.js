/**
 * Tests
 * @this {TestRunner}
 */
function TestRunner() {
  this.doTests = function() {
    var oldLogLevel = log.logLevel;
    log = new Logger(false, LogLevel.TEST);
    this.sequenceTest();
    this.parallelTest();
    this.indeterminateTest();
    this.channelTransferTest();
    this.multistatementChannelTransferTest();
    this.simpleAgentTest();
    this.agentWithChannelsTest();
    this.agentInAgentTest();
    this.sequentialAgentTest();
    this.parallelAgentTest();
    this.indeterminateAgentTest();
    log = new Logger(false, oldLogLevel);
  };

  this.sequenceTest = function() {
    log.test('--- Running sequence test ---');
    this.resetEngine();
    var testString = 'print(\'1\') . print(\'2\') . print(\'3\')';
    var expectedOutput = '1,2,3';

    this.processAndExecute(testString);
    if (this.verifyOutput(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.parallelTest = function() {
    log.test('--- Running parallel test ---');
    this.resetEngine();
    var testString = 'print(\'1\') | print(\'2\') | print(\'3\')';
    var expectedOutput = ['1,2,3', '2,3,1', '3,1,2', '1,3,2', '2,1,3', '3,2,1'];

    this.processAndExecute(testString);
    if (this.verifyMultiplePossibleOutputs(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.indeterminateTest = function() {
    log.test('--- Running indeterminate test ---');
    this.resetEngine();
    var testString = 'print(\'1\') + print(\'2\') + print(\'3\')';
    var expectedOutput = ['1', '2', '3'];

    this.processAndExecute(testString);
    if (this.verifyMultiplePossibleOutputs(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.channelTransferTest = function() {
    log.test('--- Running channel transfer test ---');
    this.resetEngine();
    var testString = 'new(a) . a!\'Hello world\' . a?x . print(x)';
    var expectedOutput = 'Hello world';

    this.processAndExecute(testString);
    if (this.verifyOutput(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.multistatementChannelTransferTest = function() {
    log.test('--- Running multistatement channel transfer test ---');
    this.resetEngine();
    var testString = ['new(a)', 'a!\'Hello world\'', 'a?x', 'print(x)'];
    var expectedOutput = 'Hello world';

    this.processAndExecuteMultipleInputs(testString);
    if (this.verifyOutput(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.simpleAgentTest = function() {
    log.test('--- Running simple agent test ---');
    this.resetEngine();
    var testString = ['A = print(\'Hello world\')', 'A'];
    var expectedOutput = 'Hello world';

    this.processAndExecuteMultipleInputs(testString);
    if (this.verifyOutput(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.agentWithChannelsTest = function() {
    log.test('--- Running agent with channels test ---');
    this.resetEngine();
    var testString = ['A = a!\'Hello world\' . a?x . b!x . b?y . print(y)'];
    testString.push('new(a) . new(b) . A');
    var expectedOutput = 'Hello world';

    this.processAndExecuteMultipleInputs(testString);
    if (this.verifyOutput(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.agentInAgentTest = function() {
    log.test('--- Running agent in agent test ---');
    this.resetEngine();
    var testString = ['A = b!x . b?y . print(y)'];
    testString.push('B = a!\'Hello world\' . a?x . A');
    testString.push('new(a) . new(b) . B');
    var expectedOutput = 'Hello world';

    this.processAndExecuteMultipleInputs(testString);
    if (this.verifyOutput(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.sequentialAgentTest = function() {
    log.test('--- Running agent in agent test ---');
    this.resetEngine();
    var testString = ['A = print(\'1\')'];
    testString.push('B = print(\'2\')');
    testString.push('C = print(\'3\')');
    testString.push('A . B . C');
    var expectedOutput = ['1,2,3'];

    this.processAndExecuteMultipleInputs(testString);
    if (this.verifyMultiplePossibleOutputs(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.parallelAgentTest = function() {
    log.test('--- Running agent in agent test ---');
    this.resetEngine();
    var testString = ['A = print(\'1\')'];
    testString.push('B = print(\'2\')');
    testString.push('C = print(\'3\')');
    testString.push('A | B | C');
    var expectedOutput = ['1,2,3', '2,3,1', '3,1,2', '1,3,2', '2,1,3', '3,2,1'];

    this.processAndExecuteMultipleInputs(testString);
    if (this.verifyMultiplePossibleOutputs(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  this.indeterminateAgentTest = function() {
    log.test('--- Running agent in agent test ---');
    this.resetEngine();
    var testString = ['A = print(\'1\')'];
    testString.push('B = print(\'2\')');
    testString.push('C = print(\'3\')');
    testString.push('A + B + C');
    var expectedOutput = ['1', '2', '3'];

    this.processAndExecuteMultipleInputs(testString);
    if (this.verifyMultiplePossibleOutputs(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL: ' + engine.getErrors() + '\n\n');
    }
  };

  //Every test should run this in the beginning
  this.resetEngine = function() {
    engine = new PiEngine();
  };

  /**
   * A helper function to load multiple statements into the engine
   * @param {string[]} testStrings
   * @this {TestRunner}
   */
  this.processAndExecuteMultipleInputs = function(testStrings) {
    for (var i = 0; i < testStrings.length; i++) {
      this.processAndExecute(testStrings[i]);
    }
  };

  /**
   * A helper function to have the engine process input
   * @param {string} testString
   */
  this.processAndExecute = function(testString) {
    var input = new EngineInput(testString);
    engine.processInput(input);
    engine.execute();
  };

  /**
   * Verifies that the engine output is as expected
   *
   * @param {string[]} expecteds
   * @this {TestRunner}
   * @return {boolean}
   */
  this.verifyMultiplePossibleOutputs = function(expecteds) {
    log.test('Checking output against multiple possible outputs:');
    for (var i = 0; i < expecteds.length; i++) {
      if (this.verifyOutput(expecteds[i])) {
        return true;
      }
    }

    return false;
  };

  /**
   * Verifies that the engine output is as expected
   *
   * @param {string} expected
   * @return {boolean}
   */
  this.verifyOutput = function(expected) {
    log.test('Checking \'' + engine.getOutput() + '\' against \'' + expected +
        '\'');
    return engine.getOutput().valueOf() == expected.valueOf();
  };

  this.doTests();
}
