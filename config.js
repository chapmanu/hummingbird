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
   * Sent to services requiring a callback url for updates
   */
  host: '127.0.0.1',
  
  
  
  /**
   * Absolute path of SSL cert files
   * Use if https = true
   */
  ssl: {
    key:  '/path/to/key.pem',
    cert: '/path/to/cert.crt'
  },
  
  
  
  /**
   * Enable HTTPS
   */
  https: false,
  
  
  
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