# Fire Up! Dependency Injector

Fire Up! is a dependency injection container specifically designed for node.js with a powerful but uncluttered API.

## Why yet another dependency injection container for node.js?

I was prepping for a new project that aimed to support [continuous deployment](http://puppetlabs.com/blog/continuous-delivery-vs-continuous-deployment-whats-diff). So fully automated testing is a must. However, my ambitions would soon falter by paralyzing bad testability without proper dependency injection. ([quick](http://csausdev.wordpress.com/2010/12/17/dependency-injection-in-node-js/) / [sophisticated](https://www.youtube.com/watch?v=JjqKQ8ezwKQ) explanation)

Great inspiration came from the [existing di containers](http://www.mariocasciaro.me/dependency-injection-in-node-js-and-other-architectural-patterns) and the [mastermind of AngaularJS' dependency injector](https://www.youtube.com/watch?v=_OGGsf1ZXMs).