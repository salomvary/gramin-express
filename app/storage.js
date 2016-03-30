'use strict'

const Events = require('events')
const path = require('path')

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

module.exports = class Storage extends Events {
  constructor() {
    super()
    this.storage = new LocalStorage()
    this.unStuckTracks()
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
    this.emit('change')
  }

  getTrack(trackPath) {
    const trackId = path.basename(trackPath)
    return this.getTracks()[trackId] || {}
  }

  updateTrack(trackPath, attributes) {
    const trackId = path.basename(trackPath)
    const tracks = this.getTracks()
    const track = tracks[trackId] || (tracks[trackId] = {})
    Object.assign(track, attributes)
    this.updateTracks(tracks)
    return track
  }

  unStuckTracks() {
    const tracks = this.getTracks()
    Object.keys(tracks).forEach(trackId => {
      const track = tracks[trackId]
      if (track.status == 'uploading')
        track.status = null
    })
    this.updateTracks(tracks)
  }
}
