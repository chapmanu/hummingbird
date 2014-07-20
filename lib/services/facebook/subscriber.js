var request = require('request');
var logger = require('../../logger.js');

/**
 * Handle subscribe/unsubscribe http requests
 */
var Subscriber = function(credentials, callback_url, api_endpoint) {
  this._credentials = credentials;
  this._callback    = callback_url;
  this._endpoint    = api_endpoint;
  this._fields      = "feed";
}


Subscriber.prototype = {
  
  /**
   * Generate request parameters for subscription
   */
  subscribeParams: function(fields) {
    return {
      access_token: this._credentials.access_token,
      object:       'page',
      fields:       fields,
      verify_token: 'hummingbird',
      callback_url: this._callback
    };
  },
  
  
  
  /**
   * Generate request parameters for unsubscribing
   */
  unsubscribeParams: function() {
    return {
      access_token: this._credentials.access_token,
      object:       'page'
    };
  },
  
  
  
  /**
   * Make a subscription request
   */
  subscribe: function() {
    var self = this;
    request.post(this._endpoint, {
        qs: self.subscribeParams(self._fields)
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          logger.info('facebook -', 'subscription confirmed');
        }
      }
    );
  },
  
  
  
  /**
   * Unsubscribe request
   */
  unsubscribe: function(subscription_name) {
    request.del(this._endpoint, {
        qs: this.unsubscribeParams()
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          logger.info('facebook -', 'unsubscribed successfully');
        }
      }
    );
  },
  
  
  
  /**
   * Unsubscribe all
   */
  unsubscribeAll: function() {
    this.unsubscribe();
  }
  
};


/** EXPORTS */
module.exports = Subscriber;