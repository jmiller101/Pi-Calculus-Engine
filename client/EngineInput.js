


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
  if (typeof this.input != 'string') {
    log.trace('Input was not of type \'string\'');
    this.isValid = false;
  } else if (!this.input) {
    log.trace('Input failed the test \'!string\'');
    this.isValid = false;
  } else if (this.input.replace(/\s/g, '') == '') {
    log.trace('Input was only whitespace');
    this.isValid = false;
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
