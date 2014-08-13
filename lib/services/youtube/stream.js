var logger = require('../../logger.js');
var util = require('util');
var google = require('googleapis');
var youtube = google.youtube('v3');
var OAuth2 = google.auth.OAuth2;

var Stream    = require('../core').Stream;
var Responder = require('./responder.js');
var Rotator   = require('../core').Rotator;
var Fetch     = require('./fetcher.js');


/**
 * Manages the connection to Youtube
 * @constructor
 * @extends Stream
 */
var YoutubeStream = function(service, credentials, accounts, keywords) {
  Stream.call(this, service, credentials, accounts, keywords);
  
  // Set credentials
  this.oauth = new OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uri
  );
  
  // Initialize rotator
  this.rotator = new Rotator(5000);
    
  // Initialize responder
  this.responder = new Responder();
  
}

/** Inherit */
util.inherits(YoutubeStream, Stream);



/**
 * Start the stream
 */
YoutubeStream.prototype.start = function() {
  if (!this.rotator.active()) {
    logger.warn(this._service, 'Stream:', 'starting...');
    this.rotator.start();
  }
}



/**
 * Stop the stream
 */
YoutubeStream.prototype.stop = function() {
  logger.warn(this._service, 'Stream:', 'stopping...');
  this.rotator.stop();
}



/**
 * Restart stream
 */
YoutubeStream.prototype.restart = function() {
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
YoutubeStream.prototype.keywords = function() {
  return this._keywords.map(function(n) {
    return n.phrase;
  });
}



/**
 * Add Keyword
 */
YoutubeStream.prototype.addKeyword = function(keyword) {
  this._keywords.push(keyword);
}



/**
 * Remove Keyword
 */
YoutubeStream.prototype.removeKeyword = function(keyword) {
  this._keywords.remove(function(n) {
    return n.phrase === keyword.phrase;
  });
}



/**
 * Accounts
 */
YoutubeStream.prototype.accounts = function() {
  return this._accounts.map(function(n) {
    return n.service_id;
  });
}



/**
 * Add Account
 */
YoutubeStream.prototype.addAccount = function(account) {
  var self = this;
  this._accounts.push(account);
  this.rotator.add({
    context: self,
    key:     JSON.stringify(account),
    params:  {
      account: account
    },
    func: function() {
      Fetch(this.oauth, account, function(videos) {
        videos.forEach(function(video) {
          this.host.emit('post', video);
        });
      });
      account.last_checked = new Date();
    }
  });
  if (!this.rotator.active()) this.rotator.start();
}



/**
 * Remove Account
 */
YoutubeStream.prototype.removeAccount = function(account) {
  var self = this;
  this._accounts.remove(function(n) {
    return n.service_id === account.service_id;
  });
  this.rotator.remove(JSON.stringify(account));
}




/** EXPORT */
module.exports = YoutubeStream;