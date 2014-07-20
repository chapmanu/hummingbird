// Dependencies
var express    = require('express');
var bodyParser = require('body-parser')
var fs         = require('fs');
var https      = require('https');


// Controllers
var accounts  = require('../controllers/accounts.js');
var keywords  = require('../controllers/keywords.js');
var callbacks = require('../controllers/callbacks.js');



/**
 * HTTP Interface
 */
var HTTPInterface = function() {
  this.app = express();
};

HTTPInterface.prototype = {
  
  initialize: function() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  },
  
  
  loadRoutes: function() {
    this.app.post(  '/accounts', accounts.create );
    this.app.delete('/accounts', accounts.destroy);

    this.app.post(  '/keywords', keywords.create );
    this.app.delete('/keywords', keywords.destroy);

    this.app.get( '/callback/:service', callbacks.receive);
    this.app.post('/callback/:service', callbacks.receive);
  },
  
  
  start: function() {
    if (HB.config.https) {
      var https_config = {
        key:  fs.readFileSync(HB.config.ssl.key),
        cert: fs.readFileSync(HB.config.ssl.cert)
      };
      https.createServer(https_config, this.app).listen(HB.config.port);
    } else {
      this.app.listen(HB.config.port);
    }
  }
  
};


/** exports */
module.exports = HTTPInterface;