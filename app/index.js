'use strict'

const config = require('./config')
const Garmin = require('./garmin')
const Login = require('./login')
const Storage = require('./storage')
const React = require('react')
const ReactDOM = require('react-dom')
const Strava = require('./strava')
const TrackList = require('./track-list')

const clientId = config.clientId
const clientSecret = config.clientSecret

const storage = new Storage()
const strava = new Strava(clientId, clientSecret, storage.getAuth())
const garmin = new Garmin()
const login = new Login(strava)

login.render()
garmin.startWatching()

const trackList = ReactDOM.render(React.createElement(TrackList, {
  onUploadClick: uploadTrack
}), document.querySelector('.content'))

strava
  .on('login', auth => storage.setAuth(auth))
  .on('logout', () => storage.deleteAuth())

garmin.on('update', updateState)
storage.on('change', updateState)

function uploadTrack(trackPath) {
  storage.updateTrack(trackPath, {
    status: 'uploading',
    error: null,
    activityId: null
  })
  strava
    .uploadTrack(trackPath)
    .then(status => onUploadSucces(trackPath, status))
    .catch(status => onUploadFail(trackPath, status))
    .catch(error => { throw error })
}

function onUploadSucces(trackPath, status) {
  storage.updateTrack(trackPath, {
    status: 'success',
    error: null,
    activityId: status.activity_id
  })
}

function onUploadFail(trackPath, status) {
  storage.updateTrack(trackPath, {
    status: 'fail',
    error: status.error,
    activityId: null
  })
}

function updateState() {
  trackList.setState({tracks: getTracks()})
}

function getTracks() {
  if (garmin.tracks)
    return garmin.tracks.map(trackPath => Object.assign({
      path: trackPath
    }, storage.getTrack(trackPath)))
}
