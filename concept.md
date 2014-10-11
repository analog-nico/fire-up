# Concept for the continued development of Fire Up!

## TODO

- Test cases for using `'fireUp/currentInjector'` to fire up modules dynamically while initializing the module itself
- Implement logging adapter
- Circular dependency detection for modules of type 'multiple instances' and for singletons in case nested fireUp calls with 'fireUp/currentInjector' are used
- Circular dependency detection for require injections with the mock in use
- New type `'multiple chached instances'` that init and cache a module according to the static args. An instance for the same static arg values gets reused.
- The options passed to the injector are dangerous for singletons because the `use` and `requireMockMapping` settings might change in the next injector call but an already created and differently wired instance is returned.

## Missing Features

- Destroy support
  - If a subcomponent shall be destroyed Fire Up! will still hold the involved singletons in its cache.
  - See https://docs.google.com/document/d/1fTR4TcTGbmExa5w2SRNAkM1fsB9kYeOvfuiI99FgR24/mobilebasic?pli=1 about releasing memory

- Live reload during development and in production
  - fireUp.again(moduleReference) ?
  - fireUp.reload(options) ?

## Experimental Features

- Using EcmaScript 6 generators as factory methods
  - Through `yield 'moduleReference'` dependencies could be requested dynamically
  - Excellent [introduction to ES6 generators](https://www.youtube.com/watch?v=OYdP1tQ9Rnw)
