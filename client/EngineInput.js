/**
 *
 * @param {String} inputString
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
    this.input.split('').forEach(function(element, index, array) {
        if (element == '(') {
            this.parentheses++;
        } else if (element == ')') {
            this.parentheses--;
        }
    }, this);

    if (this.parentheses != 0) {
        return;
    }
    this.isValid = true;
};