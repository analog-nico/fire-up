# API

## require('fire-up').newInjector(options)

  - Include dirs (-> Js files with special comment are loaded)
  - Exclude dirs
  - use ['net/connector:ftp', 'db:mock']
    -> RULE: The interface implemented by 'foo/bar' must be also implemented by any 'foo/bar:<whatever>'
    - 'db:mock' is allowed to get 'db' injected, all other modules get 'db:mock' injected for 'db'; If you use 'db:mock:performance' all modules get which require 'db' or 'db:mock' except 'db:mock:performance' and 'db:mock' which are allowed to get modules injected in the chain upwards
  - logLevel (defined as constants)
  - parentInjector

## fireUp(moduleReference) -> Promise

  - 'foo/bar'
  - 'foo/bar:mock'
  - 'foo/bar(hello)'
  - 'foo/bar:mock(hello)'
  - 'foo/bar:mock("hello")'
  - 'foo/bar:mock(\'hello\')'
  - 'foo/bar:mock(hello, true)'

## fireUp.newChildInjector(options)

## fireUp.getParentInjector(), fireUp.getChildInjectors()

## Write a module

### Flag comment

See npm package 'injector'

// Fire me up!
/^\s*\/\/\s*Fire\s*me\s*up(\s*|\s*!\s*)$/i

### Factory style

Must return a Thenable for async or any value for sync.
- additional param 'staticArgs' from () notation

### __module property

  - implements: ['namespace/name', 'net/connector/ftp', 'net/connector:ftp']
  - inject (Default: [])
    - fireUp instances -> "fireup/newInjector", "fireup/currentInjector", "fireup/childInjector"
    - "fireup" like "require(fire-up)" but with more di power, e.g. type multiple instances; means for every npm package could be provided a di wrapper
    - npm modules (never use require anymore which destroys testability) -> "require(./folder/index.js)", "require(express)"
  - type ('multiple instances', 'singleton' (default), 'shared singleton')
    - shared singleton: from parent to child (can be overwritten bei explicit fireUp or use of e.g. mock, loaded module won't be passed to parent injector - if you would need that you would use the parent injector in the first place))


### destroy function

See https://docs.google.com/document/d/1fTR4TcTGbmExa5w2SRNAkM1fsB9kYeOvfuiI99FgR24/mobilebasic?pli=1 about releasing memory

## Live reload in Production

fireUp.again(moduleReference) ?
fireUp.reload(includeDirs, excludeDirs) ?


# Load routine

  - Split by ":"
  - for each path from all to one part if match load (parts itself must exactly match!)
  - If nothing found throw error (especially don't try to use require)

  - Since a module can implement multiple interfaces pay attention to singletons. A module implementing 'foo/bar' and 'net/login' may be required through 'foo/bar' and already loaded for 'net/login'