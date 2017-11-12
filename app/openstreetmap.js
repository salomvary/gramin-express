'use strict'

const callbackWindow = require('./callback-window')
const Provider = require('./provider')
const qs = require('querystring')
const req = require('./req')

module.exports = class Openstreetmap extends Provider {
  constructor(consumerKey, consumerSecret, auth) {
    super({auth})
    this.authorizer = new Authorizer()
  }

  sendFile(track) {
    const formData = {
      file: track.path, // FIXME
      description: track.name || 'FIXME',
      visibility: 'private'
    }
    return this.authorizer.xhr({
      method: 'POST',
      path: '/api/0.6/gpx/create',
    })
    sendFile(this.auth.access_token, track)
  }
}

const requestTokenURL = 'https://api06.dev.openstreetmap.org/oauth/request_token'
const accessTokenURL = 'https://api06.dev.openstreetmap.org/oauth/access_token'
const authorizeURL = 'https://api06.dev.openstreetmap.org/oauth/authorize'

class Authorizer {
  constructor(consumerKey, consumerSecret) {
    this.consumerKey = consumerKey
    this.consumerSecret = consumerSecret
  }

  authorize() {
    this.requestToken()
      .then(authData => this.authorizeUser(authData))
      .then(authData => this.accessToken(authData))
      .then(authData => ({
        token: authData.oauth_token,
        tokenSecret: authData.oauth_token_secret
      }))
  }

  requestToken() {
    return req({
      method: 'post',
      url: requestTokenURL,
      oauth: {
        callback: 'http://localhost/callback',
        consumer_key: this.consumerKey,
        consumer_secret: this.consumerSecret
      }
    }).then(body => qs.parse(body))
  }

  authorizeUser(authData) {
    const url = authorizeURL + '?' + qs.stringify({oauth_token: authData.oauth_token})
    return callbackWindow(url)
      .then(params => qs.parse(params))
  }

  accessToken(authData) {
    return req({
      method: 'post',
      url: accessTokenURL,
      oauth: {
        consumer_key: this.consumerKey,
        consumer_secret: this.consumerSecret,
        token: authData.oauth_token,
        token_secret: authData.oauth_token_secret,
        verifier: authData.oauth_verifier
      }
    }).then(body => qs.parse(body))
  }

  deauthorize() {
    this.setAuth(null)
    return Promise.resolve()
  }

  getUser() {
    return this.xhr({
      method: 'GET',
      path: '/api/0.6/user/details'
    }).then(responseXML => {
      // See http://wiki.openstreetmap.org/wiki/API_v0.6#Details_of_a_user
      const user = responseXML.getElementsByTagName('user')[0]
      user.getAttribute('display_name')
    })
  }
}

function sendFile(accessToken, track) {
  const formData = {
    data_type: 'gpx',
    file: fs.createReadStream(track.path)
  }
  if (track.name) formData.name = track.name
  return req({
    method: 'POST',
    url: 'https://www.strava.com/api/v3/uploads',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    formData: formData
  })
}
