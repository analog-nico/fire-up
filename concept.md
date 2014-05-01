# Concept for the continued development of Fire Up!

## TODO

- Test cases for using `'fireUp/currentInjector'` to fire up modules dynamically while initializing the module itself
- Rename the terms parent interface and sub interface to base interface and extended interface in the code and debug output
- Implement logging adapter
- Circular dependency detection for modules of type 'multiple instances' and for singletons in case nested fireUp calls with 'fireUp/currentInjector' are used

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
