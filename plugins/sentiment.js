var Sediment = require('sediment');

/**
 * Sentiment Plugin
 * Calculates sentiment of post.text
 */
module.exports = function(post, cb) {
  post.attach('sentiment', Sediment.analyze(post.text()));
  
  // all done, run callback
  cb(null, post);
};