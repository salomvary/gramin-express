'use strict'

class LocalStorage {
  get(key) {
    if (key in localStorage)
      return JSON.parse(localStorage[key])
  }

  set(key, value) {
    localStorage[key] = JSON.stringify(value)
  }

  delete(key) {
    delete localStorage[key]
  }
}

module.exports = class Storage {
  constructor() {
    this.storage = new LocalStorage()
  }

  getAuth() {
    return this.storage.get('auth')
  }

  setAuth(auth) {
    this.storage.set('auth', auth)
  }

  deleteAuth() {
    this.storage.delete('auth')
  }

  getTracks() {
    return this.storage.get('tracks') || {}
  }

  updateTracks(newTracks) {
    const tracks = Object.assign(this.getTracks(), newTracks)
    this.storage.set('tracks', tracks)
  }
}
