'use strict';

// Fire me up!

module.exports = {
  implements: 'routes:extendable',
  inject: [
    'routes',           // Wraps the standard routes module
    'plugins/routes:*'  // Loads all routes modules of all plugins
  ]
};

module.exports.factory = function (standardRoutesModule, pluginRoutesModules) {

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
