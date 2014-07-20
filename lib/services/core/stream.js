var url     = require('url');
var events  = require('events');
var logger  = require('../../logger.js');

var Responder = require('./responder.js');

/**
 * Service#Stream
 * Manages the streaming connection to a social media service API.
 * Parent abstract class, intended to be inherited.
 * @constructor
 * @param {Object} credentials The auth credentials for connecting to the social media API.
 * @param {Array}  accounts    An array of accounts to track.
 * @param {Array}  keywords    An array of keywords to track.
 */
var Stream = function(service, credentials, accounts, keywords) {
  logger.info(service, 'Stream initializing...');
  
  this._service     = service;
  this._credentials = credentials;
  this._accounts    = accounts;
  this._keywords    = keywords;
  
  // Initialize responder
  this.responder = new Responder();
  
  /**
   * Emit posts with content
   */
  this.hose = new events.EventEmitter();
}



/**
 * Commands
 */
Stream.prototype.command = function(model, action, param) {
  var tree = {
    'keyword': {
      'add':    this.addKeyword,
      'remove': this.removeKeyword
    },
    'account': {
      'add':    this.addAccount,
      'remove': this.removeAccount
    }
  };
  tree[model][action].call(this, param);
}



/**
 * Start the stream.
 * @abstract
 */
Stream.prototype.start = function() {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * Stop the stream.
 * @abstract
 */
Stream.prototype.stop = function() {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * Restart the stream.
 * @abstract
 */
Stream.prototype.restart = function() {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * List Keywords for stream
 * @abstract
 */
Stream.prototype.keywords = function() {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * Add Keyword
 * @abstract
 */
Stream.prototype.addKeyword = function(keyword) {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * Remove Keyword
 * @abstract
 */
Stream.prototype.removeKeyword = function(keyword) {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * List Accounts for stream
 * @abstract
 */
Stream.prototype.accounts = function() {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * Add Account
 * @abstract
 */
Stream.prototype.addAccount = function(account) {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * Remove Account
 * @abstract
 */
Stream.prototype.removeAccount = function(account) {
  throw new Error('ParentStream: Must be implemented by subclass!');
}



/**
 * Provide a callback url based on environment settings
 */
Stream.prototype.callback_url = function() {
  var callback = {
    protocol: (hummingbird.config.https) ? 'https:' : 'http:',
    slashes:  true,
    hostname: hummingbird.config.host,
    port:     hummingbird.config.port,
    pathname: '/callback/' + this._service
  };
  return url.format(callback);
}



/** EXPORT */
module.exports = Stream;
