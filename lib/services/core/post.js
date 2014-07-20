/**
 * Post object
 * @constructor
 */
var Post = function(raw_post) {
  this._raw       = raw_post;
  this._formatted = false;
  this._post      = null;
}



/**
 * Format the post
 */
Post.prototype.format = function() {
  if (!this._formatted) {
    this._post          = this.buildScaffold(); // 1 - Make the basic post object
    this._post.author   = this.parseAuthor();   // 2 - Add post author
    this._post.mentions = this.parseMentions(); // 3 - Add account mentions
    this._post.keywords = this.parseKeywords(); // 4 - Add keywords
    this._post.urls     = this.parseURLs();     // 5 - Add URLs
    this._post.photos   = this.parsePhotos();   // 6 - Add photos if they exist
    this._post.source   = this.parseSource();   // 7 - Add source
    this._formatted     = true;                 // 8 - Set formatted post to true
    return this._post;
  } else {
    return this._post;
  }
}



/**
 * The formatted post
 */
Post.prototype.formatted = function() {
  return this.format();
}



/**
 * Formatted JSON post
 */
Post.prototype.toJSON = function() {
  return JSON.stringify(this.formatted());
}



/**
 * Attach a key/value pair to the formatted post
 */
Post.prototype.attach = function(key, value) {
  if (this._formatted && key && value && !this._post[key]) {
    this._post[key] = value;
  }
}



/**
 * Get post text
 */
Post.prototype.text = function() {
  if (this._formatted) return this._post.text;
}




/**
 * Build post scaffold
 */
Post.prototype.buildScaffold = function() {
  throw new Error('Post: Must be implemented by subclass!');
}



/**
 * Attach post author
 */
Post.prototype.parseAuthor = function() {
  throw new Error('Post: Must be implemented by subclass!');
}



/**
 * Attach mentions
 */
Post.prototype.parseMentions = function() {
  throw new Error('Post: Must be implemented by subclass!');
}



/**
 * Attach keywords
 */
Post.prototype.parseKeywords = function() {
  throw new Error('Post: Must be implemented by subclass!');
}



/**
 * Attach URLs
 */
Post.prototype.parseURLs = function() {
  throw new Error('Post: Must be implemented by subclass!');
}



/**
 * Attach Photos (if they exist)
 */
Post.prototype.parsePhotos = function() {
  throw new Error('Post: Must be implemented by subclass!');
}



/**
 * Add source
 */
Post.prototype.parseSource = function() {
  throw new Error('Post: Must be implemented by subclass!');
}



/** EXPORTS */
module.exports = Post;