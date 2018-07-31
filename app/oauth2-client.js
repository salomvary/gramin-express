'use strict'

const req = require('./req')

module.exports = function oauthClient(oauthOptions) {
  return function oauthReq(options) {
    return req(Object.assign({}, options, {
      oauth: oauthOptions
    }))
  }
}