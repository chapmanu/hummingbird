/**
 * Hummingbird configuration
 * 
 * This is the default/general configuration. Any options set in
 * the environment configuration files will override settings here.
 * To run an environment besides development, run hummingbird with
 * NODE_ENV=environment node app.js.
 */
module.exports = {
  
  
  
  /**
   * HTTP Interface
   *
   * Hummingbird requires a publicly-accessible host address
   * and port in order to communicate with the majority of the
   * services it streams. The hostname and port are used to
   * establish a subscription to real-time APIs, which attempt a
   * POST request from their server to yours every time there is
   * a new post.
   */

  // Port
  port: 1337,
  
  // Hostname
  // Can be IP address or domain name, but leave out the scheme (no http/https://)
  // Domain example: 'myhummingbirdapp.supercoolserver.com'
  host: '127.0.0.1',
  
  
  /**
   * HTTPS
   *
   * To run hummingbird over https, provide the SSL key
   * and certificate generated for your given hostname.
   * If the SSL cert does not match your hostname, it is
   * likely most service subscription attemps will fail.
   *
   * Both HTTP and HTTPS will use the port specified in
   * this configuration file, not their defaults. (which
   * are 80 and 443, respectively).
   */
  
  // Enable SSL
  https: false,
  
  // Absolute paths to key and cert
  ssl: {
    key:  '/path/to/key.pem',
    cert: '/path/to/cert.crt'
  },
  
  
  
  
  
  
  
  
  

  
  
  
  /**
   * Plugins
   *
   * Plugins are actions executed after a post object is
   * generated by its corresponding service. This is where
   * decorative/meta information can be generated, like
   * sentiment info of the post text, or third-party API
   * calls.
   *
   * Two plugins are provided with hummingbird:
   *   - Sentiment: Rapidly calculates the basic sentiment of the post text by
   *                matching words against the AFINN-111 list of words ranked
   *                by emotion.
   *   - Profanity: Uses the WebPurify API to check post text for profanity.
   *                A boolean true or false as well as an array of matched words
   *                are returned.
   */
  plugins: {
    sentiment: false,
    profanity: false
  },
  
  
  
  
  
  
  
  
  
  
  /**
   * Interfaces
   *
   * The interface deals with both incoming REST commands,
   * and the outbound post once it is processed. This is separate
   * from the adapter.
   *
   * Currently, only HTTP/S can be used for incoming commands, and
   * only redis can be used for outbout posts. HTTP settings are the
   * same as configured above.
   */
  
  // active interfaces
  // interface: {
  //   in:  'http',
  //   out: 'redis'
  // },
  
  interfaces: {
    
    // Redis
    //
    // These are default. If left blank, these values will automatically
    // be used.
    redis: {
      port:     6379,
      host:    '127.0.0.1',
      options:  null
    }
    
  },
  
  
  
  
  
  
  
  
  
  
  
  /**
   * Adapters
   *
   * The adapter is the method/mechanism in which models are stored
   * outside of memory so that hummingbird is not stateful. In the
   * event of a crash, hummingbird will restore its streams and
   * subscriptions exactly where it was when it stopped. Hummingbird
   * uses waterline as its ORM.
   *
   * Currently, the two available adapters are:
   *   - 'redis'
   *   - 'disk'.
   *
   * Data saved using the 'disk' adapter is written to .tmp/disk.db,
   * and can be erased by running the command 'make clean'.
   */

  // Active adapter
  adapter: 'disk',
  
  adapters: {
    
    // Disk
    //
    // There are no current settings for the disk adapter.
    // Please leave this null.
    disk: null,
    
    
    // Redis
    //
    // These are default. If left blank, these values will automatically
    // be used.
    redis: {
      port:     6379,
      host:    '127.0.0.1',
      options:  null
    }
    
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  /**
   * Service API configuration
   *
   * Hummingbird manages streams at the service level.
   * Services are configured here before starting the
   * application. If incorrect credentials are given to
   * a service marked as active, hummingbird will throw
   * an error and exit. 
   */
  services: {
    
    
    /**
     * Facebook
     */
    facebook: {
      
      // Is this service active?
      active: false,
      
      // app_id & app_secret required. access_token, if left blank, will be generated.
      credentials: {
        app_id:       '',
        app_secret:   '',
        access_token: null
      }
    },
    
    
    
    
    /**
     * Twitter
     */
    twitter: {
      
      // Is this service active?
      active: false,
      
      // all credentials are required
      credentials: {
        consumer_key:         '',
        consumer_secret:      '',
        access_token:         '',
        access_token_secret:  ''
      }
    },
    
    
    
    
    /**
     * Instagram
     */
    instagram: {
      
      // Is this service active?
      active: false,
      
      // all credentials required
      credentials: {
        client_id:     '',
        client_secret: ''
      }
    },
    
    
    
    
    /**
     * Wordpress
     */
    wordpress: {
      
      // Is this service active?
      active: false
      
    },
    
    
    
    
    /**
     * Youtube
     */
    youtube: {
      
      // Is this service active?
      active: false
      
    }
    
    
  }
  
  
};