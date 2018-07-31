'use strict'

const callbackWindow = require('./callback-window')
const client = require('./oauth2-client')
const qs = require('querystring')
const req = require('./req')
const url = require('url')

module.export = class OAuth2Authorizer {
  constructor(clientId, clientSecret) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }
  
  authorize() {
    this.obtainCode()
      .then(code => this.exchangeToken(code))
  }
  
  /** @private */
  obtainCode() {
    const authorizeUrl = url.format({
      protocol: 'https',
      hostname: 'www.strava.com',
      pathname: 'oauth/authorize',
      query: {
        client_id: this.clientId,
        redirect_uri: 'http://localhost/callback',
        response_type: 'code',
        scope: 'write'
      }
    })

    return callbackWindow(authorizeUrl)
      .then(params => {
        const {code, error} = qs.parse(params)
        return error ? Promise.reject(error) : code
      })
  }
  
  /** @private */
  exchangeToken(code) {
    return req({
      method: 'POST',
      url: 'https://www.strava.com/oauth/token',
      json: true,
      form: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code
      }
    })
  }
}