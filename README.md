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









## Deployment ##
In order to run, hummingbird requires:
* [node.js 0.10.x](http://nodejs.org/)
* [Redis 2.8.x](http://redis.io/)

**To deploy** (assuming node.js is installed):

1. `git clone git@github.com:chapmanu/hummingbird.git`
2. Edit `config.js` and set the necessary API credentials and server information. You can edit environment-specific credentials in the various environment files. Settings in environment config files will override config.js when that environment is specified on run.
3. Run `node app.js` and then go get yourself a beer!


## API ##




### Interaction ###
#### Updating ####
* [[Accounts]]
* [[Keywords]]

#### Receiving ####
* [[Posts]]
* [[Updates]]
* [[Deletes]]


## Architecture ##
[[Service Architecture]]
