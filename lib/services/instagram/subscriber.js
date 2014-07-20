var request = require('request');
var logger = require('../../logger.js');

/**
 * Handle subscribe/unsubscribe http requests
 */
var Subscriber = function(credentials, callback_url, api_endpoint) {
  this._credentials = credentials;
  this._callback    = callback_url;
  this._endpoint    = api_endpoint;
}


Subscriber.prototype = {
  
  /**
   * Attach subscription list to prototype to avoid callback bs
   */
  subscriptions: {},
  
  
  /**
   * Generate request parameters for subscription
   */
  subscribeParams: function(object, object_id) {
    var res = {
      client_id:     this._credentials.client_id,
      client_secret: this._credentials.client_secret,
      object:        object,
      aspect:        'media',
      verify_token:  'hummingbird',
      callback_url:  this._callback
    };
    if (object_id) res.object_id = object_id;
    return res;
  },
  
  
  
  /**
   * Generate request parameters for unsubscribing
   */
  unsubscribeParams: function(subscription_id) {
    var params = {
      client_id:     this._credentials.client_id,
      client_secret: this._credentials.client_secret
    };
    if (subscription_id==='users') {
      params.object = 'user';
    } else if (subscription_id==='all') {
      params.object = 'all';
    } else {
      params.id = subscription_id;
    }
    return params;
  },
  
  
  
  /**
   * Make a subscription request
   */
  subscribe: function(object, object_id, callback) {
    if (typeof object_id === 'function') callback = object_id;
    request.post(this._endpoint, {
        form: this.subscribeParams(object, object_id)
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var res = JSON.parse(body);
          callback(null, res.data);
        } else {
          callback(error, null);
        }
      }
    );
  },
  
  
  
  /**
   * Unsubscribe request
   */
  unsubscribe: function(subscription_name) {
    if (Subscriber.prototype.subscriptions[subscription_name]) {
      var sub_id = Subscriber.prototype.subscriptions[subscription_name];
      request.del(this._endpoint, {
          qs: this.unsubscribeParams(sub_id)
        }, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            logger.info('instagram -', subscription_name, 'unsubscribed successfully');
            delete Subscriber.prototype.subscriptions[subscription_name];
          }
        }
      );
    }
  },
  
  
  
  /**
   * Unsubscribe all
   */
  unsubscribeAll: function() {
    request.del(this._endpoint, {
        qs: this.unsubscribeParams('all')
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          Subscriber.prototype.subscriptions = {};
        }
      }
    );
  },
  
  
  
  /**
   * Make a users subscription request
   */
  subscribeUsers: function() {
    this.subscribe('user', function(error, response) {
      if (!error && response) {
        logger.info('instagram -', 'users', 'subscription confirmed');
        Subscriber.prototype.subscriptions['users'] = response.id;
      }
    });
  },
  
  
  
  /**
   * Unsubscribe from users
   */
  unsubscribeUsers: function() {
    this.unsubscribe('users');
  },
  
  
  
  /**
   * Make a tag subscription request
   */
  subscribeTag: function(tag) {
    this.subscribe('tag', tag, function(error, response) {
      if (!error && response) {
        logger.info('instagram -', response.object_id, 'subscription confirmed');
        Subscriber.prototype.subscriptions[response.object_id] = response.id;
      }
    });
  },
  
  
  /**
   * Unsubscribe a tag
   */
  unsubscribeTag: function(tag) {
    if (Subscriber.prototype.subscriptions[tag]) {
      this.unsubscribe(tag);
    }
  }
  
  
};


/** EXPORTS */
module.exports = Subscriber;