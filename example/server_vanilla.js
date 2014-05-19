'use strict';

var express = require('express'),
    logger = require('morgan'),
    app = express();

app.use(logger());

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000, function () {
  console.log('Express server started on port 3000');
  if (process.send) { process.send('running'); } // Used for automated test for this example.
});
