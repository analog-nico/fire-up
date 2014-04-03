'use strict';

describe("Regarding its instantiation, FireUp", function () {

  var _ = require('lodash');

  var fireUpLib = require('../lib/index.js');


  it('should provide a newInjector function', function (done) {

    expect(_.isFunction(fireUpLib.newInjector)).toBe(true);
    expect(_.isFunction(fireUpLib.newInjector())).toBe(true);

    done();

  });

  it('should validate the options for a new injector', function (done) {

    expect(function () { fireUpLib.newInjector();               }).not.toThrow();
    expect(function () { fireUpLib.newInjector(false);          }).toThrow();
    expect(function () { fireUpLib.newInjector(1);              }).toThrow();
    expect(function () { fireUpLib.newInjector(null);           }).toThrow();
    expect(function () { fireUpLib.newInjector(function () {}); }).toThrow();
    expect(function () { fireUpLib.newInjector({});             }).not.toThrow();

    done();

  });

});
