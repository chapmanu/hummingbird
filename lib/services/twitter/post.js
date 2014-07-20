var moment = require('moment');
var sugar  = require('sugar');
var util   = require('util');
var url    = require('url');
var Post   = require('../core').Post;


/**
 * TwitterPost
 * @constructor
 * @extends Post
 * @param {Object} tweet The raw tweet
 */
var TwitterPost = function(tweet) {
  Post.call(this,tweet);
}

/** Subclass */
util.inherits(TwitterPost, Post);



/**
 * Scaffold
 */
TwitterPost.prototype.buildScaffold = function() {
  var ext_uri = "https://twitter.com/"+this._raw.user.screen_name+"/status/"+this._raw.id_str;
  
  return {
    service:      'twitter',
    service_id:   this._raw.id_str,
    timestamp:    this.parseTimestamp(),
    text:         this._raw.text,
    external_uri: ext_uri
  }
}



/**
 * Author
 */
TwitterPost.prototype.parseAuthor = function() {
  return {
    service:      'twitter',
    service_id:   this._raw.user.id_str,
    user_name:    this._raw.user.screen_name,
    display_name: this._raw.user.name,
    description:  this._raw.user.description,
    avatar:       this._raw.user.profile_image_url
  };
}
 
 

/**
 * Mentions
 */
TwitterPost.prototype.parseMentions = function() {
  return this._raw.entities.user_mentions.map(function(n) {
    return {
      service:      'twitter',
      service_id:   n.id_str,
      user_name:    n.screen_name,
      display_name: n.name
    };
  });
}
 
 

/**
 * Keywords
 */
TwitterPost.prototype.parseKeywords = function() {
  return this._raw.entities.hashtags.map(function(n) {
    return {
      phrase: n.text.toLowerCase()
    };
  });
}
 
 

/** 
 * Urls
 */
TwitterPost.prototype.parseURLs = function() {
  return this._raw.entities.urls.map(function(n) {
    return {
      domain:     url.parse(n.expanded_url).hostname,
      link:       n.expanded_url,
      short_link: n.url
    };
  });
}
 
 

/**
 * Photos
 */
TwitterPost.prototype.parsePhotos = function() {
  var photos = [];
  if (this._raw.entities.media) {
    photos = this._raw.entities.media.map(function(n) {
      return {
        image: n.media_url
      };
    });
  }
  return photos;
}
 
 

/**
 * Source
 */
TwitterPost.prototype.parseSource = function() {
  return {
    service:      'twitter',
    name:         'Twitter',
    description:  'Social networking and microblogging service utilising instant messaging, SMS or a web interface.',
    domain:       'twitter.com',
    external_uri: 'https://twitter.com/'
  };
}



/**
 * Timestamp
 */
TwitterPost.prototype.parseTimestamp = function() {
  return moment(this._raw.created_at, "ddd MMM DD HH:mm:ss Z YYYY").toISOString();
}





/** EXPORTS */
module.exports = TwitterPost;