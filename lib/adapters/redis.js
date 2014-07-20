/**
 * Redis Adapter
 */
module.exports = {
  adapter: require('sails-redis'),
  
  connection: {
    adapter: 'redis',
    host:     HB.config.adapters.redis.host,
    port:     HB.config.adapters.redis.port
  }
};