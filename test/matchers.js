'use strict';

module.exports =  {

  toThrowOfType: function(expected) {
    var result = false;
    var exception;
    if (typeof this.actual !== 'function') {
      throw new Error('Actual is not a function');
    }
    if (typeof expected !== 'function') {
      throw new Error('Expected is not an error constructor.');
    }
    try {
      this.actual();
    } catch (e) {
      exception = e;
    }
    if (exception) {
      result = exception instanceof expected;
    }

    var not = this.isNot ? "not " : "";

    this.message = function() {
      if (exception) {
        return "Expected function " + not + "to throw an exception of type " + expected.name + ", but it threw an exception of type " + exception.name + ".";
      } else {
        return "Expected function to throw an exception.";
      }
    };

    return result;
  }

};
