var async = require('async');
var Queue = require('./queue.js');

/**
 * Pipeline
 */
var Pipeline = function() {};


Pipeline.prototype = {
  
  post: function(post) {
    if (HB.plugins.length > 0) {
      async.reduce(HB.plugins, post, function(memo, item, callback) {
        item(memo, function(err, p) {
          callback(null, memo);
        });
      }, function(err, final_post) {
        if (!err) Queue.post(post);
      });
    } else {
      Queue.post(post);
    }  
  },
  
  
  
  update: function(update) {
    // perform some action to update
    
    Queue.update(update);
  },
  
  
  
  delete: function(delete_request) {
    // perform some action to delete request
    
    Queue.delete(delete_request);
  }
  
};



/** EXPORT */
module.exports = Pipeline = new Pipeline();