var logger = require('../../logger.js');
var util = require('util');
var request = require('request');
var Insta   = require('instagram-node-lib');

var Stream     = require('../core').Stream;
var Responder  = require('./responder.js');
var Subscriber = require('./subscriber.js');


/**
 * Manages the streaming connection to Instagram
 * @constructor
 * @extends Stream
 */
var InstagramStream = function(service, credentials, accounts, keywords) {
  Stream.call(this, service, credentials, accounts, keywords);
  
  // Set up instagram-node-lib
  Insta.set('client_id',     credentials.client_id);
  Insta.set('client_secret', credentials.client_secret);
    
  // Set api endpoint URL for subscriber
  this.api_endpoint = 'https://api.instagram.com/v1/subscriptions/';
  
  // Initialize subscriber object
  this.subscriber = new Subscriber(credentials, this.callback_url(), this.api_endpoint);
    
  // Initialize responder
  this.responder = new Responder();
  
  // Start listening for incoming
  process.nextTick(function() {
      this.delegateResponder();
    }.bind(this));
  
}

/** Inherit */
util.inherits(InstagramStream, Stream);



/**
 * Start the stream
 */
InstagramStream.prototype.start = function() {
  logger.warn(this._service, 'Stream:', 'starting...');
  
  // Subscribe to users
  this.subscriber.subscribeUsers();
  
  // Subscribe to tags
  if (this._keywords.length > 0) {
    var self = this;
    this.keywords().forEach(function(keyword) {
      self.subscriber.subscribeTag(keyword);
    });
  }
  
}



/**
 * Stop the stream
 */
InstagramStream.prototype.stop = function() {
  logger.warn(this._service, 'Stream:', 'stopping...');
  this.subscriber.unsubscribeAll();
}



/**
 * Restart stream
 */
InstagramStream.prototype.restart = function() {
  logger.warn(this._service, 'Stream:', 'Restart initiated');
  this.stop();
  process.nextTick(function() {
      this.start();
    }.bind(this)
  );
}



/**
 * Keywords
 */
InstagramStream.prototype.keywords = function() {
  return this._keywords.map(function(n) {
    return n.phrase;
  });
}



/**
 * Add Keyword
 */
InstagramStream.prototype.addKeyword = function(keyword) {
  this._keywords.push(keyword);
  this.subscriber.subscribeTag(keyword.phrase);
}



/**
 * Remove Keyword
 */
InstagramStream.prototype.removeKeyword = function(keyword) {
  this.subscriber.unsubscribeTag(keyword.phrase);
  this._keywords.remove(function(n) {
    return n.phrase === keyword.phrase;
  });
}



/**
 * Accounts
 */
InstagramStream.prototype.accounts = function() {
  return this._accounts.map(function(n) {
    return n.service_id;
  });
}



/**
 * Add Account
 */
InstagramStream.prototype.addAccount = function(account) {
  this._accounts.push(account);
}



/**
 * Remove Account
 */
InstagramStream.prototype.removeAccount = function(account) {
  this._accounts.remove(function(n) {
    return n.service_id === account.service_id;
  });
}







/**
 * Handle callback updates
 *
 * This needs to be rewritten handled when we reach a larger scale.
 * One way:
 *   - Individual user requests are made with their account auth token.
 *   - tag requests are placed into a queue. The queue makes requests on
 *     a set interval, with the last media ID stored to place a bottom limit.
 *     The request returns the # of most recent according to the queue #, and
 *     then the queue # of that tag gets reset to 0. Even better would be to adjust
 *     the request interval according to the amount of tags queued (or expected) in
 *     order to ensure we fall within the 5000 requests/key limit. If we exceed
 *     that amount and need to maintain realtime, another possibility is to rotate
 *     through account auth tokens instead of using the client_id.
 */
InstagramStream.prototype.delegateResponder = function() {
  var self = this;
  this.responder.incoming.on('update', function(update) {
    if (update.changed_aspect==='media') { // make sure we're not checking for user updates
      
      // tag
      if (update.object==='tag') {
        Insta.tags.recent({name: update.object_id,
          complete: function(data, pagination) {
            self.hose.emit('post', data[0]);
          }
        });
      }
      
      // User
      if (update.object==='user') {
        Insta.users.recent({user_id: update.object_id,
          complete: function(data, pagination) {
            self.hose.emit('post', data[0]);
          } 
        });
      }
      
    }
  });
}




/** EXPORT */
module.exports = InstagramStream;