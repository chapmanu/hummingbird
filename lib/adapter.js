var Waterline = require('waterline');

// Adapters
var disk_adapter   = require('./adapters/disk.js');
var redis_adapter  = require('./adapters/redis.js');
var memory_adapter = require('./adapters/memory.js');


// Models
var account_model = require('./models/account.js');
var keyword_model = require('./models/keyword.js');


// Config
var config = {
  adapters: {
    'default': memory_adapter.adapter,
     memory:   memory_adapter.adapter,
     disk:     disk_adapter.adapter,
     redis:    redis_adapter.adapter
  },
  connections: {}
};

if (HB.config.adapter === 'memory')  config.connections.memory_connection  = memory_adapter.connection;
if (HB.config.adapter === 'disk')    config.connections.disk_connection    = disk_adapter.connection;
if (HB.config.adapter === 'redis')   config.connections.redis_connection   = redis_adapter.connection;



/**
 * Initialize the adapter
 */
module.exports.initialize = function() {
  var waterline = new Waterline();
  
  waterline.loadCollection(Waterline.Collection.extend(account_model));
  waterline.loadCollection(Waterline.Collection.extend(keyword_model));
  
  // Start Waterline
  waterline.initialize(config, function(err, models) {
    if(err) throw err;
    
    global.Account = models.collections['accounts-'+HB.env];
    global.Keyword = models.collections['keywords-'+HB.env];
    
  });
};