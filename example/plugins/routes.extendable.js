'use strict';

// Fire me up!

module.exports = {
  implements: 'routes:extendable',
  inject: [
    'plugins/routes:*',  // Loads all routes modules of all plugins
    'routes'             // Wraps the standard routes module
  ]
};

module.exports.factory = function (pluginRoutesModules, standardRoutesModule) {

  function register(app) {
    // Registering the routes of all plugin modules
    for (var interfaceName in pluginRoutesModules) {
      if (pluginRoutesModules.hasOwnProperty(interfaceName)) {

        pluginRoutesModules[interfaceName].register(app);

      }
    }

    // Finally registering the standard routes
    standardRoutesModule.register(app);
  }

  return { register: register };

};
