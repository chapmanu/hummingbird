var google = require('googleapis');
var youtube = google.youtube('v3');
var moment  = require('moment');




var mapResults = function(n) {
  return n.id.videoId;
}


/**
 * Fetch Youtube Videos
 */
module.exports = function(oauth, account, cb) {
  oauth.setCredentials({ access_token: account.auth_token });
  var search_params = {
    auth:       oauth,
    type:      'video'
    part:      'id',
    order:     'date',
    channelId:  account.service_id
  };
  if (account.last_checked) {
    search_params.publishedAfter = moment(account.last_checked).toISOString();
  }
  
  youtube.search.list(search_params, function(err, results) {
    if (results.items.length > 0) {
      var ids = results.items.map(mapResults).join(','); 
      youtube.videos.list({
        auth:  oauth,
        part: 'snippet',
        id:    ids
      }, function(err, videos) {
        cb(videos.items);
      });
    } else {
      cb([]);
    }
  });
};