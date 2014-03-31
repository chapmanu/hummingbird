/**
 * Twitter Service Configuration
 */
module.exports = {
  
  
  // Is this service active?
  active: true,
  
  
  
  /**
   * Set API credentials here
   * Can have nested development/production specific if needed
   */
  credentials: {
    
    development: {
      consumer_key:         '',
      consumer_secret:      '',
      access_token:         '',
      access_token_secret:  ''
    },
    
    production: {
      consumer_key:         '',
      consumer_secret:      '',
      access_token:         '',
      access_token_secret:  ''
    }
    
  }
  
  
};