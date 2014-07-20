var events  = require('events');
var logger = require('../../logger.js');
var Responder = require('../../responder.js');

// Service Modules
var Stream = require('./stream.js');
var Post   = require('./post.js');


/**
 * Service
 * Manages all interactions with a social media service API, including streams, tracking info, etc.
 * This is a parent class template, meant to be inherited.
 * @constructor
 */
var Service = function(stream, post) {
  this._credentials = [];
  this._status      = {};
  this._modules = {
    stream:   stream   || Stream,
    post:     post     || Post
  };
}



/**
 * Configuration
 * Define configuration for the service here, like ident name, max allowed keywords/accounts, etc.
 * {
 *   SERVICE_NAME: 'service',
 *   MAX_KEYWORDS: 0,
 *   MAX_ACCOUNTS: 0
 * }
 * @abstract
 */
Service.prototype.configuration = function() {
  throw new Error('ParentService: Must be implemented by subclass!');
}



/**
 * Boot the service: request credentials, stored accounts, stored keywords.
 */
Service.prototype.boot = function(params) {
  logger.info(this.configuration.SERVICE_NAME, 'service', 'booting...');
  
  // Load params
  //var params = Mediator.request(this.configuration.SERVICE_NAME);
  this._credentials = params.credentials;
  
  // Instantiate new stream
  this.stream = new this._modules.stream(
    this.configuration.SERVICE_NAME,
    params.credentials,
    params.accounts,
    params.keywords
  );
  
  // Inject callback responder
  Responder.addService(this.configuration.SERVICE_NAME, this.stream.responder);
  this.Responder = this.stream.responder;
  
  // Start listening/delegating messages
  this.delegate();
  
  // Start the stream
  process.nextTick(function() {
      this.stream.start();
    }.bind(this)
  );
}



/**
 * Delegate incoming requests from inside
 */
Service.prototype.command = function(model, action, param) {
  logger.info(this.configuration.SERVICE_NAME, 'command received:', {model: model, action: action, param: param});
  this.stream.command(model, action, param);
}



/**
 * Listen to event emitters and delegate accordingly
 */
Service.prototype.delegate = function() {
  var self = this;
  
  // Post stream
  this.stream.hose.on('post', function(post) {
    var p = new self._modules.post(post);
    logger.info('post received:', {
      service: p.formatted().service, 
      service_id: p.formatted().service_id 
    });
    self.hose.emit('post',p);
  });
  
  // Delete stream
  this.stream.hose.on('delete', function(delete_msg) {
    var dm = {
      service: self.configuration.SERVICE_NAME,
      service_id: delete_msg.service_id
    };
    logger.info('delete request received:', dm);
    self.hose.emit('delete', dm);
  })
  
  // Actions from inside
  //Switchboard.inside.on(self.configuration.SERVICE_NAME, function(response) {
  //  self.command(response.model, response.action, response.param);
  //});
  
}




/** Service Hose */
Service.prototype.hose = new events.EventEmitter();



/**
 * TODO
 * - notifications
 * - max-limit warnings/handling
 */




/** EXPORTS */
module.exports = Service;