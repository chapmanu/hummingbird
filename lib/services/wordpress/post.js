var moment = require('moment');
var sugar  = require('sugar');
var util   = require('util');
var url    = require('url');
var Post   = require('../core').Post;


/**
 * WordpressPost
 * @constructor
 * @extends Post
 * @param {Object} post The raw wordpress post
 */
var WordpressPost = function(post) {
  Post.call(this,post);
}

/** Subclass */
util.inherits(WordpressPost, Post);



/**
 * Scaffold
 */
WordpressPost.prototype.buildScaffold = function() {
  return {
    service:      'wordpress',
    service_id:   this._raw.post.guid,
    timestamp:    this.parseTimestamp(),
    text:         this._raw.post.post_title,
    external_uri: this._raw.post.permalink
  }
}



/**
 * Author
 */
WordpressPost.prototype.parseAuthor = function() {
  return {
    service:      'wordpress',
    service_id:   this._raw.post.post_author.id,
    user_name:    this._raw.post.post_author.username,
    display_name: this._raw.post.post_author.display_name,
    description:  this._raw.post.post_author.description,
    avatar:       this._raw.post.post_author.avatar_url
  };
}
 
 

/**
 * Mentions
 */
WordpressPost.prototype.parseMentions = function() {
  return [];
}
 
 

/**
 * Keywords
 */
WordpressPost.prototype.parseKeywords = function() {
  return this._raw.post.tags.map(function(n) {
    return {
      phrase: n.toLowerCase()
    };
  });
}
 
 

/** 
 * Urls
 */
WordpressPost.prototype.parseURLs = function() {
  return [];
}
 
 

/**
 * Photos
 */
WordpressPost.prototype.parsePhotos = function() {
  return [{
    image: this._raw.post.image.url
  }];
}
 
 

/**
 * Source
 */
WordpressPost.prototype.parseSource = function() {
  return {
    service:      'wordpress',
    name:         this._raw.source.name,
    description:  this._raw.source.description,
    domain:       this._raw.source.domain,
    external_uri: this._raw.source.home_url
  };
}



/**
 * Timestamp
 */
WordpressPost.prototype.parseTimestamp = function() {
  return moment(this._raw.post.post_date, "YYYY-MM-DD HH:mm:ss").toISOString();
}




/** EXPORTS */
module.exports = WordpressPost;
