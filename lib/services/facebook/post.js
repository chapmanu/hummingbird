var moment = require('moment');
var sugar  = require('sugar');
var util   = require('util');
var url    = require('url');
var Post   = require('../core').Post;


/**
 * FacebookPost
 * @constructor
 * @extends Post
 * @param {Object} post The raw facebook post
 */
var FacebookPost = function(post) {
  Post.call(this,post);
}

/** Subclass */
util.inherits(FacebookPost, Post);



/**
 * Scaffold
 */
FacebookPost.prototype.buildScaffold = function() {
  var split_id = this._raw.id.split("_");
  var external_url = 'https://facebook.com/'+split_id[0]+"/posts/"+split_id[1];
  return {
    service:      'facebook',
    service_id:   this._raw.id,
    timestamp:    this.parseTimestamp(),
    text:         this._raw.message,
    external_uri: external_url
  }
}



/**
 * Author
 */
FacebookPost.prototype.parseAuthor = function() {
  return {
    service:      'facebook',
    service_id:   this._raw.from.id,
    display_name: this._raw.from.name
  };
}
 
 

/**
 * Mentions
 */
FacebookPost.prototype.parseMentions = function() {
  var mentions = [];
  if (this._raw.message_tags) {
    mentions.add(this._raw.message_tags.map(function(n) {
      return {
        service:      'facebook',
        service_id:   n.id,
        display_name: n.name
      }
    }));
  }
  if (this._raw.with_tags) {
    mentions.add(this._raw.with_tags.map(function(n) {
      return {
        service:      'facebook',
        service_id:   n.id,
        display_name: n.name
      }
    }));
  }
  return mentions;
}
 
 

/**
 * Keywords
 */
FacebookPost.prototype.parseKeywords = function() {
  return [];
}
 
 

/** 
 * Urls
 */
FacebookPost.prototype.parseURLs = function() {
  var urls = [];
  if (this._raw.link && this._raw.type==="link") {
    urls.add({
      domain: url.parse(this._raw.link).hostname,
      link:   this._raw.link
    });
  }
  return urls;
}
 
 

/**
 * Photos
 */
FacebookPost.prototype.parsePhotos = function() {
  var photos = [];
  if (this._raw.picture) {
    photos.add({
      image: this._raw.picture.replace('_s.jpg', '_o.jpg')
    });
  }
  return photos;
}
 
 

/**
 * Source
 */
FacebookPost.prototype.parseSource = function() {
  return {
    service:      'facebook',
    name:         'Facebook',
    description:  "Facebook is a social utility that connects people with friends and others who work, study and live around them.",
    domain:       'facebook.com',
    external_uri: 'https://facebook.com/'
  };
}



/**
 * Timestamp
 */
FacebookPost.prototype.parseTimestamp = function() {
  return moment.utc(this._raw.created_time).toISOString();
}





/** EXPORTS */
module.exports = FacebookPost;