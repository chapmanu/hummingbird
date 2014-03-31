var WebPurify = require('webpurify');

/**
 * Profanity checking plugin
 * Uses WebPurify to check for profanity or
 *   other offensive content in the text of a post
 *
 * More info/calls available at https://github.com/mileszim/webpurify
 * API key required from http://webpurify.com
 */



/** Configure */

var wp = new WebPurify({
    api_key: 'my_api_key'
    //, endpoint:   'us'  // Optional, available choices: 'eu', 'ap'. Default: 'us'.
    //, enterprise: false // Optional, set to true if you are using the enterprise API, allows SSL
});



/** Run */
module.exports = function(post, cb) {
  wp.return(post.text(), function(err, profanity) {
    
    // uh oh error
    if (err) {
      cb(err);
    } else {
      
      // attach to post
      post.attach('profanity', {
        exists: (profanity.length>0),
        matched: profanity
      });
      
      // done, callback
      cb(null, post);
    }
  });
};