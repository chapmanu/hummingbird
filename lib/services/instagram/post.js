var moment = require('moment');
var sugar  = require('sugar');
var util   = require('util');
var url    = require('url');
var Post   = require('../core').Post;


/**
 * InstagramPost
 * @constructor
 * @extends Post
 * @param {Object} post The raw instagram post
 */
var InstagramPost = function(post) {
  Post.call(this,post);
}

/** Subclass */
util.inherits(InstagramPost, Post);



/**
 * Scaffold
 */
InstagramPost.prototype.buildScaffold = function() {
  return {
    service:      'instagram',
    service_id:   this._raw.id,
    timestamp:    this.parseTimestamp(),
    text:         this._raw.caption && this._raw.caption.text,
    external_uri: this._raw.link
  }
}



/**
 * Author
 */
InstagramPost.prototype.parseAuthor = function() {
  return {
    service:      'instagram',
    service_id:   this._raw.user.id,
    user_name:    this._raw.user.username,
    display_name: this._raw.user.full_name,
    description:  this._raw.user.bio,
    avatar:       this._raw.user.profile_picture
  };
}
 
 

/**
 * Mentions
 */
InstagramPost.prototype.parseMentions = function() {
  return this._raw.users_in_photo.map(function(n) {
    return {
      service:      'instagram',
      service_id:   n.user.id,
      user_name:    n.user.username,
      display_name: n.user.full_name,
      avatar:       n.user.profile_picture
    };
  });
}
 
 

/**
 * Keywords
 */
InstagramPost.prototype.parseKeywords = function(n) {
  return this._raw.tags.map(function(n) {
    return n.toLowerCase();
  });
}
 
 

/** 
 * Urls
 */
InstagramPost.prototype.parseURLs = function() {
  return [];
}
 
 

/**
 * Photos
 */
InstagramPost.prototype.parsePhotos = function() {
  return [{
    image: this._raw.images.standard_resolution.url
  }];
}
 
 

/**
 * Source
 */
InstagramPost.prototype.parseSource = function() {
  return {
    service:      'instagram',
    name:         'Instagram',
    description:  "Capture and Share the World's Moments.",
    domain:       'instagram.com',
    external_uri: 'http://instagram.com/'
  };
}



/**
 * Timestamp
 */
InstagramPost.prototype.parseTimestamp = function() {
  return moment.unix(this._raw.created_time).toISOString();
}





/** EXPORTS */
module.exports = InstagramPost;