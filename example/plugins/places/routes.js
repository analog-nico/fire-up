'use strict';

// Fire me up!

module.exports = {
  implements: 'plugins/routes:places'
};

module.exports.factory = function () {

  function register(app) {
    app.get('/places/:location', function(req, res){
      res.send('Welcome to ' + req.params.location);
    });
  }

  return { register: register };

};
