'use strict'

const Events = require('events')

module.exports = class Provider extends Events {
  constructor({auth}) {
    super()
    this.auth = auth
  }

  uploadTrack(track) {
    return this.login()
      .then(() => this.sendFile(track))
  }

  setAuth(auth) {
    this.auth = auth
    if (auth)
      this.emit('login', auth)
    else
      this.emit('logout', auth)
    return auth
  }

  login() {
    if (!this.auth)
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
}
