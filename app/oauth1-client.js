'use strict'

const req = require('./req')

module.exports = function oauthClient(accessToken) {
  return function oauthReq(options) {
    return req(Object.assign({}, options, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }))
  }
}