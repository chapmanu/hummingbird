var path = require('path');

// App dependencies
var utils = require('./utils.js');
var Interface = require('./interface.js');


module.exports = {
  
  /**
   * Boot the Application
   */
  boot: function() {
    this.initialize(); // Config
    this.adapter();    // Adapter
    this.interface();  // Inteface
  },
  
  
  
  
  /**
   * Initialize Configuration/App
   */
  initialize: function() {
    // don't run twice
    if (HB && HB.hb) return HB.hb;
  
    // initialize hummingbird object
    var HB = {
      path:   utils.loadPaths(),
      env:    process.env['NODE_ENV'] || 'development'
    };
    
    // load primary config into memory
    HB.config = require(utils.path('config', 'config'));
  
    // reconcile environment config
    var env_config = require(utils.path('config', HB.env));
    HB.config = utils.merge(HB.config, env_config);
  
    // load active plugins into memory
    HB.plugins = {};
    for (var p in HB.config.plugins) {
      if (HB.config.plugins[p]) HB.plugins[p] = require(utils.path('plugins', p));
    }
  
    // load active services into memory
    HB.services = {};
    for (var s in HB.config.services) {
      if (HB.config.services[s].active) HB.services[s] = require(utils.path('lib', 'services', s));
    }
  
    // new hb instance
    HB.hb = require(utils.path('lib','hummingbird'));
  
    // set global
    global.HB = HB;
    
    return HB.hb;
  },
  
  
  
  /**
   * Initialize Adapter
   */
  adapter: function() {
    require('./adapter.js').initialize();
  },
  
  
  
  /**
   * Initialize Interface
   */
  interface: function() {
    var i = new Interface();
    i.initialize();
    i.loadRoutes();
    i.start();
  }
};