var util = require('util');
var logger = require('../../logger.js');
var Twit = require('twit');
var Stream = require('../core').Stream;
var Responder = require('./responder.js');


/** @constant */ var QUEUE_PERIOD_DEFAULT = 65000;


/**
 * Manages the streaming connection to Twitter
 * @constructor
 * @extends Stream
 */
var TwitterStream = function(service, credentials, accounts, keywords) {
  Stream.call(this, service, credentials, accounts, keywords);
  this._twit = new Twit(credentials);
  this.responder = new Responder();
  
  this._changes = [];
  this._interval = setInterval(this.intervalMethod.bind(this), QUEUE_PERIOD_DEFAULT);
}

/** Inherit */
util.inherits(TwitterStream, Stream);




/**
 * Override Stream#command
 * Adds command to changes queue to be executed on interval
 */
TwitterStream.prototype.command = function(model, action, param) {
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
  this._changes.push(tree[model][action].bind(this, param));
}




/**
 * Start the stream
 */
TwitterStream.prototype.start = function() {
  logger.warn(this._service, 'Stream:', 'starting...');
  
  var self = this;
  var params = {};
  if (this._accounts.length > 0) params.follow = this.accounts();
  if (this._keywords.length > 0) params.track  = this.keywords();
  if (this._accounts.length > 0 || this._keywords.length > 0) {
    this._stream = this._twit.stream('statuses/filter', params);
    
    // Incoming tweet
    this._stream.on('tweet', function(tweet) {
      self.hose.emit('post', tweet);
    });
    
    // Incoming delete
    this._stream.on('delete', function(delete_msg) {
      self.hose.emit('delete', {service_id: delete_msg.delete.status.id_str});
    });
    
    // Handle error
    this._stream.on('error', function(error) {
      logger.error(self._service, 'Stream: ', 'Error - ', error.toString());
      logger.error(self._service, 'Stream: ', 'Queue interval reset, restarting in 60 seconds.');
      //self.stop();
      clearTimeout(self._interval);
      self._interval = setInterval(self.intervalMethod.bind(self), QUEUE_PERIOD_DEFAULT);
    });
    
  }
}



/**
 * Stop the stream
 */
TwitterStream.prototype.stop = function() {
  logger.warn(this._service, 'Stream:', 'stopping...');
  if (this._stream) {
    try {
      this._stream.stop();
    } catch (e) {
      logger.error(this._service, 'Stream: ', e.toString());
    }
  }
}



/**
 * Restart stream
 */
TwitterStream.prototype.restart = function() {
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
TwitterStream.prototype.keywords = function() {
  return this._keywords.map(function(n) {
    return n.phrase;
  });
}



/**
 * Add Keyword
 */
TwitterStream.prototype.addKeyword = function(keyword) {
  this._keywords.push(keyword);
}



/**
 * Remove Keyword
 */
TwitterStream.prototype.removeKeyword = function(keyword) {
  this._keywords.remove(function(n) {
    return n.phrase === keyword.phrase;
  });
}



/**
 * Accounts
 */
TwitterStream.prototype.accounts = function() {
  return this._accounts.map(function(n) {
    return n.service_id;
  });
}



/**
 * Add Account
 */
TwitterStream.prototype.addAccount = function(account) {
  this._accounts.push(account);
}



/**
 * Remove Account
 */
TwitterStream.prototype.removeAccount = function(account) {
  this._accounts.remove(function(n) {
    return n.service_id === account.service_id;
  });
}



/**
 * Commit Changes
 */
TwitterStream.prototype.commitChanges = function() {
  logger.warn(this._service, 'Stream:', 'commiting changes...');
  for (var i in this._changes) {
    this._changes[i]();
  }
  this._changes = [];
  this.restart();
}



/**
 * Queue Interval Function
 */
TwitterStream.prototype.intervalMethod = function() {
  if (this._changes.length > 0) {
    this.commitChanges.call(this);
  }
}




/** EXPORT */
module.exports = TwitterStream;