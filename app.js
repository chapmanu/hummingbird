var fs     = require('fs');
var events = require('events');

/**
 * Initialize the hummingbird namespace
 */
var H = {
  
  // main config
  config: require('./config.js'),
  
  // service config
  services: {}
  
};


// Load services
fs.readdirSync('./services').forEach(function(s) {
  H.services[s.replace('.js','')] = require('./services/'+s);
});



// Make it global
global.hummingbird = H;


// Set Process ENV
process.env['PORT']     = hummingbird.config.port;
process.env['NODE_ENV'] = hummingbird.config.environment;

// Start the core
require('hummingbird-core');