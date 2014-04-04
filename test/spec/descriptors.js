'use strict';

describe('The descriptor module', function () {

  var descriptor = require('../../lib/core/descriptor.js');

  it('should validate interface names', function (done) {

    expect(descriptor.validateInterfaceName()).toBe(false);
    expect(descriptor.validateInterfaceName(null)).toBe(false);
    expect(descriptor.validateInterfaceName(false)).toBe(false);
    expect(descriptor.validateInterfaceName(5)).toBe(false);
    expect(descriptor.validateInterfaceName(function () {})).toBe(false);
    expect(descriptor.validateInterfaceName({})).toBe(false);
    expect(descriptor.validateInterfaceName([])).toBe(false);
    expect(descriptor.validateInterfaceName('')).toBe(false);

    expect(descriptor.validateInterfaceName(":test")).toBe(false);
    expect(descriptor.validateInterfaceName("test:")).toBe(false);
    expect(descriptor.validateInterfaceName("te::st")).toBe(false);
    expect(descriptor.validateInterfaceName("test:test:")).toBe(false);
    expect(descriptor.validateInterfaceName(":test:test")).toBe(false);
    expect(descriptor.validateInterfaceName("te(st)")).toBe(false);
    expect(descriptor.validateInterfaceName("t(es)t")).toBe(false);
    expect(descriptor.validateInterfaceName("te(st")).toBe(false);
    expect(descriptor.validateInterfaceName("test)")).toBe(false);
    expect(descriptor.validateInterfaceName("te)st")).toBe(false);
    expect(descriptor.validateInterfaceName("test(")).toBe(false);
    expect(descriptor.validateInterfaceName("(test)")).toBe(false);
    expect(descriptor.validateInterfaceName("test:te(st)")).toBe(false);
    expect(descriptor.validateInterfaceName("test:t(es)t")).toBe(false);
    expect(descriptor.validateInterfaceName("test:te(st")).toBe(false);
    expect(descriptor.validateInterfaceName("test:test)")).toBe(false);
    expect(descriptor.validateInterfaceName("test:te)st")).toBe(false);
    expect(descriptor.validateInterfaceName("test:test(")).toBe(false);
    expect(descriptor.validateInterfaceName("test:(test)")).toBe(false);
    expect(descriptor.validateInterfaceName("test: ")).toBe(false);
    expect(descriptor.validateInterfaceName("test:t ")).toBe(false);
    expect(descriptor.validateInterfaceName("test: est")).toBe(false);
    expect(descriptor.validateInterfaceName("test:t st")).toBe(false);
    expect(descriptor.validateInterfaceName(" :test")).toBe(false);
    expect(descriptor.validateInterfaceName("t :test")).toBe(false);
    expect(descriptor.validateInterfaceName(" est:test")).toBe(false);
    expect(descriptor.validateInterfaceName("t st:test")).toBe(false);

    expect(descriptor.validateInterfaceName("test")).toBe(true);
    expect(descriptor.validateInterfaceName("test/test")).toBe(true);
    expect(descriptor.validateInterfaceName("test:test")).toBe(true);
    expect(descriptor.validateInterfaceName("test:t:t")).toBe(true);
    expect(descriptor.validateInterfaceName("test/foo:test/bar")).toBe(true);
    expect(descriptor.validateInterfaceName("€")).toBe(true);

    done();

  });

  it('should parse interface names', function (done) {

    expect(descriptor.parseInterfaceName("test")).toEqual(["test"]);
    expect(descriptor.parseInterfaceName("test/test")).toEqual(["test/test"]);
    expect(descriptor.parseInterfaceName("test:test")).toEqual(["test", "test"]);
    expect(descriptor.parseInterfaceName("test:t:t")).toEqual(["test", "t", "t"]);
    expect(descriptor.parseInterfaceName("test/foo:test/bar")).toEqual(["test/foo", "test/bar"]);
    expect(descriptor.parseInterfaceName("€")).toEqual(["€"]);

    done();

  });

  it('should validate module references', function (done) {

    expect(descriptor.validateModuleReference()).toBe(false);
    expect(descriptor.validateModuleReference(null)).toBe(false);
    expect(descriptor.validateModuleReference(false)).toBe(false);
    expect(descriptor.validateModuleReference(5)).toBe(false);
    expect(descriptor.validateModuleReference(function () {})).toBe(false);
    expect(descriptor.validateModuleReference({})).toBe(false);
    expect(descriptor.validateModuleReference([])).toBe(false);
    expect(descriptor.validateModuleReference('')).toBe(false);

    expect(descriptor.validateModuleReference(":test")).toBe(false);
    expect(descriptor.validateModuleReference("test:")).toBe(false);
    expect(descriptor.validateModuleReference("te::st")).toBe(false);
    expect(descriptor.validateModuleReference("test:test:")).toBe(false);
    expect(descriptor.validateModuleReference(":test:test")).toBe(false);
    expect(descriptor.validateModuleReference("t(es)t")).toBe(false);
    expect(descriptor.validateModuleReference("te(st")).toBe(false);
    expect(descriptor.validateModuleReference("test)")).toBe(false);
    expect(descriptor.validateModuleReference("te)st")).toBe(false);
    expect(descriptor.validateModuleReference("test(")).toBe(false);
    expect(descriptor.validateModuleReference("(test)")).toBe(false);
    expect(descriptor.validateModuleReference("test()")).toBe(false);
    expect(descriptor.validateModuleReference("test(test) ")).toBe(false);
    expect(descriptor.validateModuleReference("test(test);")).toBe(false);
    expect(descriptor.validateModuleReference("test:t(es)t")).toBe(false);
    expect(descriptor.validateModuleReference("test:te(st")).toBe(false);
    expect(descriptor.validateModuleReference("test:test)")).toBe(false);
    expect(descriptor.validateModuleReference("test:te)st")).toBe(false);
    expect(descriptor.validateModuleReference("test:test(")).toBe(false);
    expect(descriptor.validateModuleReference("test:(test)")).toBe(false);
    expect(descriptor.validateModuleReference("test:test()")).toBe(false);
    expect(descriptor.validateModuleReference("test:test(test) ")).toBe(false);
    expect(descriptor.validateModuleReference("test:test(test);")).toBe(false);
    expect(descriptor.validateModuleReference("test: ")).toBe(false);
    expect(descriptor.validateModuleReference("test:t ")).toBe(false);
    expect(descriptor.validateModuleReference("test: est")).toBe(false);
    expect(descriptor.validateModuleReference("test:t st")).toBe(false);
    expect(descriptor.validateModuleReference(" :test")).toBe(false);
    expect(descriptor.validateModuleReference("t :test")).toBe(false);
    expect(descriptor.validateModuleReference(" est:test")).toBe(false);
    expect(descriptor.validateModuleReference("t st:test")).toBe(false);

    expect(descriptor.validateModuleReference("test")).toBe(true);
    expect(descriptor.validateModuleReference("test/test")).toBe(true);
    expect(descriptor.validateModuleReference("test:test")).toBe(true);
    expect(descriptor.validateModuleReference("test:t:t")).toBe(true);
    expect(descriptor.validateModuleReference("test/foo:test/bar")).toBe(true);
    expect(descriptor.validateModuleReference("€")).toBe(true);
    expect(descriptor.validateModuleReference("test(x)")).toBe(true);
    expect(descriptor.validateModuleReference("test/test(x)")).toBe(true);
    expect(descriptor.validateModuleReference("test:test(x)")).toBe(true);
    expect(descriptor.validateModuleReference("test:t:t(x)")).toBe(true);
    expect(descriptor.validateModuleReference("test/foo:test/bar(x)")).toBe(true);
    expect(descriptor.validateModuleReference("€(x)")).toBe(true);
    expect(descriptor.validateModuleReference("test(\"test\",'test' ,true, false, 0, 0.5, hello world!,hello world!, hello world! )")).toBe(true);

    done();

  });

  it('should parse module references', function (done) {

    expect(descriptor.parseModuleReference("test")).toEqual({ segments: ["test"], args: [] });
    expect(descriptor.parseModuleReference("test/test")).toEqual({ segments: ["test/test"], args: [] });
    expect(descriptor.parseModuleReference("test:test")).toEqual({ segments: ["test", "test"], args: [] });
    expect(descriptor.parseModuleReference("test:t:t")).toEqual({ segments: ["test", "t", "t"], args: [] });
    expect(descriptor.parseModuleReference("test/foo:test/bar")).toEqual({ segments: ["test/foo", "test/bar"], args: [] });
    expect(descriptor.parseModuleReference("€")).toEqual({ segments: ["€"], args: [] });
    expect(descriptor.parseModuleReference("test(x)")).toEqual({ segments: ["test"], args: ["x"] });
    expect(descriptor.parseModuleReference("test/test(x)")).toEqual({ segments: ["test/test"], args: ["x"] });
    expect(descriptor.parseModuleReference("test:test(x)")).toEqual({ segments: ["test", "test"], args: ["x"] });
    expect(descriptor.parseModuleReference("test:t:t(x)")).toEqual({ segments: ["test", "t", "t"], args: ["x"] });
    expect(descriptor.parseModuleReference("test/foo:test/bar(x)")).toEqual({ segments: ["test/foo", "test/bar"], args: ["x"] });
    expect(descriptor.parseModuleReference("€(x)")).toEqual({ segments: ["€"], args: ["x"] });
    expect(descriptor.parseModuleReference("test(\"test\",'test' ,true, false, 0, 0.5, hello world!,hello world!, hello world! )")).toEqual({ segments: ["test"], args: ["test", "test", true, false, 0, 0.5, "hello world!", "hello world!", "hello world!"] });

    done();

  });

});
