var fs     = require('fs');
var events = require('events');

/**
 * Initialize the hummingbird namespace
 */
var H = {
  
  // main config
  config: require('./config.js'),
  
  // service config
  services: {},
  
  // plugins
  plugins: []
  
};


// Load services
fs.readdirSync('./services').forEach(function(s) {
  H.services[s.replace('.js','')] = require('./services/'+s);
});


// Load plugins
H.config.plugins.forEach(function(plugin) {
  H.plugins.push(require('./plugins/'+plugin+'.js'));
});



// Make it global
global.hummingbird = H;


// Set Process ENV
hummingbird.config.port        = process.env['PORT']     || hummingbird.config.port;
hummingbird.config.environment = process.env['NODE_ENV'] || hummingbird.config.environment;


// Start the core
require('hummingbird-core');