/**
 * Tests
 * @this {TestRunner}
 */
function TestRunner() {
  this.doTests = function() {
    log = new Logger(false, LogLevel.TEST);
    this.sequenceTest();
    this.parallelTest();
    this.indeterminateTest();
    log = new Logger(false, LogLevel.TRACE);
  };

  this.sequenceTest = function() {
    log.test('--- Running sequence test ---');
    this.resetEngine();
    var testString = 'print(\'1\') . print(\'2\') . print(\'3\')';
    var expectedOutput = '1,2,3';

    var input = new EngineInput(testString);
    engine.processInput(input);
    engine.execute();
    if (this.verifyOutput(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL\n\n');
    }
  };

  this.parallelTest = function() {
    log.test('--- Running parallel test ---');
    this.resetEngine();
    var testString = 'print(\'1\') | print(\'2\') | print(\'3\')';
    var expectedOutput = ['1,2,3', '2,3,1', '3,1,2', '1,3,2', '2,1,3', '3,2,1'];

    var input = new EngineInput(testString);
    engine.processInput(input);
    engine.execute();
    if (this.verifyMultiplePossibleOutputs(expectedOutput)) {
      log.test('TEST PASS\n\n');
    } else {
      log.test('TEST FAIL\n\n');
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
      log.test('TEST FAIL\n\n');
    }
  };

  //Every test should run this in the beginning
  this.resetEngine = function() {
    engine = new PiEngine();
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
