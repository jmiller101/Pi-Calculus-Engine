/**
 * A wrapper for the input string that validates it
 *
 * @param {string} inputString
 * @constructor
 */
function EngineInput(inputString) {
  this.input = inputString;

  this.isValid = false;
  this.parentheses = 0;

  this.validateInput();
}


/**
 * Validates the input string
 *
 * @this {EngineInput}
 */
EngineInput.prototype.validateInput = function() {
  if (!checkString(this.input)) {
    return;
  }

  this.input.split('').forEach(function(element, index, array) {
    if (element == '(') {
      this.parentheses++;
    } else if (element == ')') {
      this.parentheses--;
    }
  }, this);

  if (this.parentheses != 0) {
    log.trace('Input had unmatched parentheses');
    return;
  }
  this.isValid = true;
};


/**
 * Helper function for checking individual strings
 *
 * @param {string} string
 * @return {boolean}
 */
function checkString(string) {
  if (typeof string != 'string') {
    log.trace('Input was not of type \'string\'');
    return false;
  } else if (!string) {
    log.trace('Input failed the test \'!string\'');
    return false;
  } else if (string.replace(/\s/g, '') == '') {
    log.trace('Input was only whitespace');
    return false;
  }

  return true;
}
