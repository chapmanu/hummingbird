hummingbird
===========

ATTENTION: This app is undergoing serious refactoring from an independent application into a module you can require into your own Node apps. This module will be at https://github.com/chapmanu/hb. The documentation is ongoing and incomplete, but you can get details in the [wiki](https://github.com/chapmanu/hummingbird/wiki).


## What is Hummingbird? ##
Hummingbird is an independent node.js application that makes connecting to/managing real-time social media interactions simple. Real-time updates are processed by hummingbird and then placed into a Redis queue for whatever you want to do with them.

### Supported Services ###
* [Twitter](#twitter)
* [Facebook](#facebook)
* [Instagram](#instagram)
* [Wordpress](#wordpress)


## Using Hummingbird ##

Hummingbird is manipulated strictly through a REST api, and each interaction must be defined by the service requesting a modification.


### Accounts ###

Accounts for social media can be tracked my making REST calls to the `/accounts` endpoint.
Supported by twitter, facebook, instagram

#### Create ####
`POST /accounts`
* `service=twitter` - (REQUIRED)
* `service_id=123456789` - (REQUIRED) Must be the numerical ID of the twitter account
* `auth_token=sdfsdfsdf` - (facebook, instagram) Must be obtained by the oauth process of those services.

#### Destroy ####
`DELETE /accounts`
* `service=twitter` - (REQUIRED)
* `service_id=123456789` - (REQUIRED) Must be the numerical ID of the twitter account

### Keywords ###

Keywords are equivalent to hashtags without the hashtag, just the raw content.
Supported by twitter, facebook, instagram.

#### Create ####
`POST /keywords`
* `service=twitter` - (REQUIRED)
* `phrase=my keyword` - (REQUIRED) The phrase to track. Be sure to omit the "#" symbol.

#### Destroy ####
`DELETE /keywords`
* `service=twitter` - (REQUIRED)
* `phrase=my keyword` - (REQUIRED) The phrase to track. Be sure to omit the "#" symbol.



### Posts ###

When a real-time update is received, Hummingbird generates a post and stores it on your Redis queue.

Hummingbird posts normalize the updates into a single, consistent JSON format, regardless of the service it came from. Complete documentation on the structure of a [post is available in the wiki](https://github.com/chapmanu/hummingbird/wiki/Post-JSON-structure-definition).


#### Example Post ###

```javascript
{
  service:      'twitter',
  service_id:   '123456790',                                      // string, id of tweet
  timestamp:    '2014-03-19T10:08:00.070Z',                       // string, ISO 8601 timestamp of tweet
  text:         'text @mention #keyword text',                    // string, tweet text content
  external_uri: 'http://service.com/service_id/status/123456790', // string, twitter tweet url
  ...
}
```


## Deployment ##
In order to run, hummingbird requires:
* [node.js 0.10.x](http://nodejs.org/)
* [Redis 2.8.x](http://redis.io/)

**To deploy** (assuming node.js is installed):

1. `git clone git@github.com:chapmanu/hummingbird.git`
2. Edit `config.js` and set the necessary API credentials and server information. You can edit environment-specific credentials in the various environment files. Settings in environment config files will override config.js when that environment is specified on run.
3. Run `node app.js` and then go get yourself a beer!
