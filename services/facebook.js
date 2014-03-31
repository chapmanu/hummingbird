/**
 * Facebook Service Configuration
 */
module.exports = {
  
  
  // Is this service active?
  active: false,
  
  
  
  /**
   * Set API credentials here
   * Can have nested development/production specific if needed
   */
  credentials: {
    
    development: {
      app_id:       '',
      app_secret:   '',
      access_token: ''
    },
    
    production: {
      app_id:       '',
      app_secret:   '',
      access_token: ''
    }
    
  }
  
  
};