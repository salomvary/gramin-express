'use strict'

module.exports = {
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  openstreetmap: {
    // Set this to http://api.openstreetmap.org/ in production
    url: 'http://master.apis.dev.openstreetmap.org/',
    // Obtain consumer key and secret here:
    // http://www.openstreetmap.org/user/username/oauth_clients/new
    oauth_consumer_key: 'your_oauth_consumer_key',
    oauth_secret: 'your_oauth_secret'
  }
}
