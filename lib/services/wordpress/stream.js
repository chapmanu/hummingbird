var logger = require('../../logger.js');
var util = require('util');

var Stream     = require('../core').Stream;
var Responder  = require('./responder.js');


/**
 * Manages the streaming connection to Wordpress
 * @constructor
 * @extends Stream
 */
var WordpressStream = function(service, credentials, accounts, keywords) {
  Stream.call(this, service, credentials, accounts, keywords);
  
  // Initialize responder
  this.responder = new Responder();
  
}

/** Inherit */
util.inherits(WordpressStream, Stream);



/**
 * Start the stream
 */
WordpressStream.prototype.start = function() {
  logger.warn(this._service, 'Stream:', 'starting...');
  
  // Start listening for incoming
  this.delegateResponder();
}



/**
 * Stop the stream
 */
WordpressStream.prototype.stop = function() {
  logger.warn(this._service, 'Stream:', 'stopping...');
  this.hose.removeAllListeners();
}



/**
 * Restart stream
 */
WordpressStream.prototype.restart = function() {
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
WordpressStream.prototype.keywords = function() {
  return this._keywords.map(function(n) {
    return n.phrase;
  });
}



/**
 * Add Keyword
 */
WordpressStream.prototype.addKeyword = function(keyword) {
  this._keywords.push(keyword);
}



/**
 * Remove Keyword
 */
WordpressStream.prototype.removeKeyword = function(keyword) {
  this._keywords.remove(function(n) {
    return n.phrase === keyword.phrase;
  });
}



/**
 * Accounts
 */
WordpressStream.prototype.accounts = function() {
  return this._accounts.map(function(n) {
    return n.service_id;
  });
}



/**
 * Add Account
 */
WordpressStream.prototype.addAccount = function(account) {
  this._accounts.push(account);
}



/**
 * Remove Account
 */
WordpressStream.prototype.removeAccount = function(account) {
  this._accounts.remove(function(n) {
    return n.service_id === account.service_id;
  });
}







/**
 * Handle callback updates
 */
WordpressStream.prototype.delegateResponder = function() {
  var self = this;
  this.responder.incoming.on('update', function(update) {
    
    // update post
    if (update.action==='update_post') {
      self.hose.emit('post', update);
    }
    
    // delete post
    if (update.action==='delete_post') {
      self.hose.emit('delete', {service_id: update.post.guid});
    }
    
  });
}




/** EXPORT */
module.exports = WordpressStream;