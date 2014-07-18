var fs   = require('fs');
var path = require('path');

// App dependencies
var utils = require('./utils.js');


/**
 * Hummingbird
 *
 * @constructor
 */
var Hummingbird = function() {
  if (!(this instanceof Hummingbird)) return new Hummingbird();
  
};


/**
 * Initialize Hummingbird
 */
Hummingbird.initialize = function() {
  
  // initialize hummingbird object
  var H = {
    path:   utils.loadPaths(),
    env:    process.env['NODE_ENV'] || 'development'
  };
    
  // load primary config into memory
  H.config = require(utils.path('config', 'config'));
  
  // reconcile environment config
  var env_config = require(utils.path('config', H.env));
  H.config = utils.merge(H.config, env_config);
  
  // load active plugins into memory
  H.plugins = {};
  for (var p in H.config.plugins) {
    if (H.config.plugins[p]) H.plugins[p] = require(utils.path('plugins', p));
  }
  
  // load active services into memory
  H.services = {};
  for (var s in H.config.services) {
    if (H.config.services[s].active) H.services[s] = require(utils.path('services', s));
  }
  
  // set global
  global.hummingbird = H;
  
};


module.exports = Hummingbird;