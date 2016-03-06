'use strict'

const Events = require('events')
const path = require('path')
const shell = require('electron').shell

module.exports = class TrackList extends Events {
  constructor(strava, garmin, storage) {
    super()
    this.strava = strava
    this.garmin = garmin
    this.storage = storage
    this.template = document.getElementById('track-template').content
    this.trackList = document.getElementById('tracks')
    this.noTracks = document.getElementById('no-tracks')
    this.noDevice = document.getElementById('no-device')
    garmin.on('update', () => this.render())
    storage.on('change', () => this.render())
  }

  onUploadClick(trackPath) {
    this.uploadTrack(trackPath)
  }

  uploadTrack(trackPath) {
    this.storage.updateTrack(trackPath, {
      status: 'uploading',
      error: null,
      activityId: null
    })
    this.strava
      .uploadTrack(trackPath)
      .then(status => this.onUploadSucces(trackPath, status))
      .catch(status => this.onUploadFail(trackPath, status))
      .catch(error => console.error(error))
  }

  onUploadSucces(trackPath, status) {
    this.storage.updateTrack(trackPath, {
      status: 'success',
      error: null,
      activityId: status.activity_id
    })
  }

  onUploadFail(trackPath, status) {
    this.storage.updateTrack(trackPath, {
      status: 'fail',
      error: status.error,
      activityId: null
    })
  }

  render() {
    this.trackList.textContent = ''
    this.noTracks.classList.add('hidden')
    this.noDevice.classList.add('hidden')
    if (this.garmin.tracks)
      if (this.garmin.tracks.length)
        this.garmin.tracks
          .map(trackPath => this.renderTrack(trackPath))
          .forEach(track => this.trackList.appendChild(track))
      else
        this.noTracks.classList.remove('hidden')
    else
      this.noDevice.classList.remove('hidden')
  }

  renderTrack(trackPath) {
    const element = document.importNode(this.template, true)
    const track = this.storage.getTrack(trackPath)
    const button = element.querySelector('.track-upload-button')
    const link = element.querySelector('.track-activity-link')
    link.onclick = openExternal

    element
      .querySelector('.track-name')
      .textContent = path.basename(trackPath)

    element
      .querySelector('.track-error')
      .innerHTML = track.error || ''

    button.onclick = this.onUploadClick.bind(this, trackPath)
    if (track.status == 'uploading') {
      button.disabled = true
      button.textContent = 'Uploading…'
    } else {
      button.disabled = false
      button.textContent = 'Upload'
    }

    if (track.status == 'success') {
      button.classList.add('hidden')
      link.classList.remove('hidden')
      link.href = 'https://www.strava.com/activities/' + track.activityId
    } else {
      button.classList.remove('hidden')
      link.classList.add('hidden')
      link.href = ''
    }

    return element
  }
}

function openExternal(event) {
  event.preventDefault()
  shell.openExternal(this.href)
}
