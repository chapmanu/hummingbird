var sugar  = require('sugar');
var util   = require('util');
var url    = require('url');
var Post   = require('../core').Post;


/**
 * YoutubePost
 * @constructor
 * @extends Post
 * @param {Object} video The raw video
 */
var YoutubePost = function(video) {
  Post.call(this,video);
}

/** Subclass */
util.inherits(YoutubePost, Post);



/**
 * Scaffold
 */
YoutubePost.prototype.buildScaffold = function() {
  var ext_uri = "https://www.youtube.com/watch?v="+this._raw.id;
  
  return {
    service:      'youtube',
    service_id:   this._raw.id,
    timestamp:    this._raw.snippet.publishedAt,
    text:         this._raw.snippet.title,
    external_uri: ext_uri
  }
}



/**
 * Author
 */
YoutubePost.prototype.parseAuthor = function() {
  return {
    service:      'youtube',
    service_id:   this._raw.snippet.channelId,
    user_name:    this._raw.snippet.channelTitle,
    display_name: this._raw.snippet.channelTitle
  };
}
 
 

/**
 * Mentions
 */
YoutubePost.prototype.parseMentions = function() {
  return [];
}
 
 

/**
 * Keywords
 */
YoutubePost.prototype.parseKeywords = function() {
  return this._raw.snippet.tags.map(function(n) {
    return {
      phrase: n.toLowerCase()
    };
  });
}
 
 

/** 
 * Urls
 */
YoutubePost.prototype.parseURLs = function() {
  return [];
}
 
 

/**
 * Photos
 */
YoutubePost.prototype.parsePhotos = function() {
  return [{
    image: this._raw.snippet.thumbnails.maxres.url
  }];
}
 
 

/**
 * Source
 */
YoutubePost.prototype.parseSource = function() {
  return {
    service:      'youtube',
    name:         'Youtube',
    description:  'Hosts user-generated videos. Includes network and professional content.',
    domain:       'youtube.com',
    external_uri: 'https://youtube.com/'
  };
}





/** EXPORTS */
module.exports = YoutubePost;