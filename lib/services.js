var sugar = require('sugar');

var logger   = require('./logger.js');
var Pipeline = require('./pipeline.js');


/**
 * Services
 * @constructor
 */
var Services = function() {
  
  this._services = {};
  
}



/**
 * Proxy command to service
 */
Services.prototype.command = function(service, params) {
  this._services[service].command(params.model, params.action, params.param);
}



/**
 * Load services
 * Attaches service responder
 */
Services.prototype.load = function() {
  var self = this
  Object.each(HB.config.services, function(service, params) {
    if (params.active) {
      var s = require('./services/'+service);
      self._services[service] = s;
      //Responder.addService(service, s.Responder);
      self.connect(s);
    }
  });
}



/**
 * Initialize accounts and keywords
 */
Services.prototype.initialize = function(cb) {
  logger.info('Initializing service information...');
  var self = this;
  Account.find({}, function(err, accounts) {
    Keyword.find({}, function(err, keywords) {
      cb(accounts, keywords);
    });
  });
}



/**
 * Attach event listeners to service hose
 */
Services.prototype.connect = function(service) {
  service.hose.on('post',   function(post)    { Pipeline.post(post)      });
  service.hose.on('update', function(update)  { Pipeline.update(update)  });
  service.hose.on('delete', function(del_req) { Pipeline.delete(del_req) });
}



/**
 * Boot services
 * Run Service.boot() with creds, accts, keywords
 */
Services.prototype.boot = function() {
  var self = this;
  this.initialize(function(accounts, keywords) {
    logger.info('Booting services...');
    
    Object.each(HB.config.services, function(service, params) {
      if (params.active) {
        try {
          self._services[service].boot({
            credentials: self.credentials(service),
            accounts: self.filterModel(accounts, service),
            keywords: self.filterModel(keywords, service)
          });
        } catch (e) {
          logger.error(e.toString());
        }
      }
    });
    
  });
}



/**
 * Reduce/filter model to service, returning condensed version
 */
Services.prototype.filterModel = function(model, service) {
  return model.filter(function(n) {
    return n.service===service
  }).map(function(n) {
    return n.condensed() 
  });
}




/**
 * Safely get credentials
 */
Services.prototype.credentials = function(service) {
  if (HB.config.services[service].credentials !== null) {
    return HB.config.services[service].credentials;
  } else {
    return {};
  }
}



/** EXPORT */
module.exports = Services = new Services();