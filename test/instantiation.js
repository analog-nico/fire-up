'use strict';

describe("Regarding its instantiation, FireUp", function () {

  var _ = require('lodash');

  var fireUpLib = require('../lib/index.js');


  it('should provide a newInjector function', function (done) {

    expect(_.isFunction(fireUpLib.newInjector)).toBe(true);
    expect(_.isFunction(fireUpLib.newInjector())).toBe(true);

    done();

  });

});
