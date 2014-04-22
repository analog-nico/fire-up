'use strict';

var _ = require('lodash');


function Options() {

  this.basePath = undefined;
  this.modules = undefined;

  Object.defineProperty(this, 'use', {
    get: function () {
      return this.__use;
    },
    set: function (array) {
      if (_.isUndefined(this.__use)) {
        this.__use = _.uniq(array);
      } else {
        this.__use = _.union(this.__use, array);
      }
    }
  });

  this.use = [];


}
Options.prototype = Object.create(Object.prototype);
Options.prototype.constructor = Options;


module.exports = Options;
