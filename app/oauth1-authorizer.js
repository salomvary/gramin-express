'use strict'

const callbackWindow = require('./callback-window')
const qs = require('querystring')
const req = require('./req')

const requestTokenURL = 'https://api06.dev.openstreetmap.org/oauth/request_token'
const accessTokenURL = 'https://api06.dev.openstreetmap.org/oauth/access_token'
const authorizeURL = 'https://api06.dev.openstreetmap.org/oauth/authorize'

/**
 * http://wiki.openstreetmap.org/wiki/OAuth
 */
module.exports = class OAuth1Authorizer {
  constructor(consumerKey, consumerSecret) {
    this.consumerKey = consumerKey
    this.consumerSecret = consumerSecret
  }

  authorize() {
    return this.requestToken()
      .then(authData => this.authorizeUser(authData))
      .then(authData => this.accessToken(authData))
  }

  deauthorize() {
    return Promise.resolve()
  }

  /** @private */
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

  /** @private */
  authorizeUser(authData) {
    const url = authorizeURL + '?' + qs.stringify({oauth_token: authData.oauth_token})
    return callbackWindow(url)
      .then(params => Object.assign({}, authData, qs.parse(params)))
  }

  /** @private */
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
}