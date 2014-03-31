/**
 * Hummingbird configuration
 */
module.exports = {
  
  /**
   * Node environment
   */
  environment: 'development',
  
  
  
  /**
   * Port
   */
  port: 1337,
  
  
  
  /**
   * Public host hummingbird is running on
   * Used so services can make incoming post request
   */
  host: '127.0.0.1',
  
  
  
  /**
   * Plugins to decorate/modify post
   */
  plugins: [
    // 'sentiment',
    // 'profanity'
  ],
  
  
  
  /**
   * Hose adapter
   */
  hose: 'redis',
  
  /**
   * Configure redis
   */
  redis: {
    port:     6379,
    host:    '127.0.0.1',
    options:  null
  }
  
  
};