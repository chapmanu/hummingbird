var redis  = require("redis");
var logger = require('./logger.js');



/**
 * DEPRECATED
 *
 * Manages interaction with Redis queue
 * @constructor
 * @param {number} port    Redis port
 * @param {string} host    Redis host address
 * @param {Object} options Redis connection options
 */
var Queue = function() {
  
  // Redis default configuration
  this.config = {
    port:     6379,
    host:    '127.0.0.1',
    options:  null
  };
    
  // Resque queue base name
  var RESQUE_BASE = 'resque:queue:';
  
  // Queues
  this.queues = {
    post_queue:   RESQUE_BASE+'post_queue',
    delete_queue: RESQUE_BASE+'delete_queue'
  };
  
};



/**
 * Connect to Redis
 */
Queue.prototype.connect = function(config) {
  if (config) this.config = config;
  logger.info('Queue', 'Connecting to Redis', this.config);
  this.client = redis.createClient(this.config.port, this.config.host, this.config.options);
}



/**
 * Add post to queue
 * @param {Post} post The post to queue
 */
Queue.prototype.post = function(post) {
  var job = { 
    'class': 'PostReceiver',
    'args': [post.formatted()]
  };
  this.client.rpush(this.queues.post_queue, JSON.stringify(job));
}



/**
 * Add delete request to queue
 * @param {Object} delete_msg The delete msg to queue
 */
Queue.prototype.delete = function(delete_msg) {
  var job = { 
    'class': 'DeleteReceiever',
    'args': [delete_msg]
  };
  this.client.rpush(this.queues.delete_queue, JSON.stringify(job));
}



/** EXPORT */
module.exports = Queue = new Queue();