# Fire Up! Dependency Injector

[![Build Status](https://travis-ci.org/analog-nico/fire-up.svg?branch=master)](https://travis-ci.org/analog-nico/fire-up) [![Dependencies up to date](https://david-dm.org/analog-nico/fire-up.png)](https://david-dm.org/analog-nico/fire-up)

Fire Up! is a dependency injection container specifically designed for node.js with a powerful but sleek API.

## What you can expect

- Fire Up! has a well designed API that allows you to get rid of any hardcoded require call.
- Your code requires minimal boilerplate code and remains highly maintainable.
- You may choose to initialize your modules by easily injecting specific implementations for more general interfaces. E.g. replace a socket by a secure socket.
- You can implement your automated tests by easily injecting your mocks and spies.
- Fire Up! is a functional and robust library with very high test coverage far beyond the 100% a test coverage tool can measure.
- If you configure something wrong you will always get a helpful error message.

## Why yet another dependency injection container for node.js?

I was prepping for a new project that aimed to support [continuous deployment](http://puppetlabs.com/blog/continuous-delivery-vs-continuous-deployment-whats-diff). So fully automated testing is a must. However, my ambitions would soon falter by paralyzing bad testability without proper dependency injection. ([quick](http://csausdev.wordpress.com/2010/12/17/dependency-injection-in-node-js/) / [sophisticated](https://www.youtube.com/watch?v=JjqKQ8ezwKQ) explanation)

Great inspiration came from the [existing di containers](http://www.mariocasciaro.me/dependency-injection-in-node-js-and-other-architectural-patterns) and the [mastermind of AngaularJS' dependency injector](https://www.youtube.com/watch?v=_OGGsf1ZXMs).

## Getting Started

Description forthcoming.