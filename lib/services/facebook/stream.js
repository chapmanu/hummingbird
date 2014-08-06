var logger = require('../../logger.js');
var util = require('util');
var fbgraph = require('fbgraph');

var Stream     = require('../core').Stream;
var Responder  = require('./responder.js');
var Subscriber = require('./subscriber.js');


/**
 * Manages the streaming connection to Facebook
 * @constructor
 * @extends Stream
 */
var FacebookStream = function(service, credentials, accounts, keywords) {
  Stream.call(this, service, credentials, accounts, keywords);
  
  // Initialize FBGraph
  fbgraph.setAccessToken(credentials.access_token);
  
  // Set api endpoint URL for subscriber
  this.api_endpoint = 'https://graph.facebook.com/'+ credentials.app_id +'/subscriptions/';
  
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
util.inherits(FacebookStream, Stream);



/**
 * Start the stream
 */
FacebookStream.prototype.start = function() {
  logger.warn(this._service, 'Stream:', 'starting...');
  this.subscriber.subscribe();
}



/**
 * Stop the stream
 */
FacebookStream.prototype.stop = function() {
  logger.warn(this._service, 'Stream:', 'stopping...');
  this.subscriber.unsubscribe();
}



/**
 * Restart stream
 */
FacebookStream.prototype.restart = function() {
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
FacebookStream.prototype.keywords = function() {
  return this._keywords.map(function(n) {
    return n.phrase;
  });
}



/**
 * Add Keyword
 */
FacebookStream.prototype.addKeyword = function(keyword) {
  this._keywords.push(keyword);
}



/**
 * Remove Keyword
 */
FacebookStream.prototype.removeKeyword = function(keyword) {
  this._keywords.remove(function(n) {
    return n.phrase === keyword.phrase;
  });
}



/**
 * Accounts
 */
FacebookStream.prototype.accounts = function() {
  return this._accounts.map(function(n) {
    return n.service_id;
  });
}



/**
 * Add Account
 */
FacebookStream.prototype.addAccount = function(account) {
  this._accounts.push(account);
}



/**
 * Remove Account
 */
FacebookStream.prototype.removeAccount = function(account) {
  this._accounts.remove(function(n) {
    return n.service_id === account.service_id;
  });
}




/**
 * Handle callback updates
 */
FacebookStream.prototype.delegateResponder = function() {
  var self = this;
  this.responder.incoming.on('update', function(update) {
    update.changes.forEach(function(change) {
      
      // new post
      if (change.field==="feed" && change.value.verb==="add") {
        var url = update.id+"/posts?until="+update.time+"&limit="+update.changes.length;
        fbgraph.get(url, function(err, res) {
          res.data.forEach(function(post) {
            
            // post type == 'photo'
            if (post.type === 'photo') {
              fbgraph.get('/' + post.object_id, function(err, photo) {
                post.images = photo.images;
                self.hose.emit('post', post);
              });
            }
            
            // other post type
            else {
              self.hose.emit('post', post);
            }
            
          });
        });
      }
      
      // delete post
      if (change.field==="feed" && change.value.verb==="remove") {
        self.hose.emit('delete', {service_id: change.value.post_id});
      }
      
    });
  });
}




/** EXPORT */
module.exports = FacebookStream;
