'use strict'

const Events = require('events')

module.exports = class OAuthApi extends Events {
  constructor(authorizer, auth) {
    super()
    this.authorizer = authorizer
    this.auth = auth
  }

  req(options) {
    return this.login().then(req => req(options))
  }

  login() {
    if (!this.token || !this.tokenSecret)
      return this.authorizer
        .authorize()
        .then(auth => this.setAuth(auth))
    else
      return Promise.resolve(this.auth)
  }

  logout() {
    if (this.auth)
      this.authorizer
        .deauthorize(this.auth)
        .then(() => this.setAuth(null))
    else
      return Promise.resolve(null)
  }

  /** @private */
  setAuth(auth) {
    this.auth = auth
    if (auth)
      this.emit('login', auth)
    else
      this.emit('logout', auth)
    return auth
  }
}
