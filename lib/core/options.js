'use strict';

function Options() {

  Object.defineProperty(this, 'basePath', {
    get: function () {
      return this.__basePath;
    },
    set: function (value) {
      this.__basePath = value;
    }
  });

  this.modules = undefined;
  this.use = undefined;

}
Options.prototype = Object.create(Object.prototype);
Options.prototype.constructor = Options;


module.exports = Options;
