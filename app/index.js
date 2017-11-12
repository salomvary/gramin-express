'use strict'

const { basename, extname } = require('path')
const config = require('./config')
const Garmin = require('./garmin')
const Openstreetmap = require('./openstreetmap')
const Storage = require('./storage')
const React = require('react')
const ReactDOM = require('react-dom')
const Settings = require('./settings')
const shell = require('electron').shell
const Strava = require('./strava')
const TrackList = require('./track-list')

const clientId = config.clientId
const clientSecret = config.clientSecret

const storage = new Storage()
const strava = new Strava(clientId, clientSecret, storage.getAuth())
const openstreetmap = new Openstreetmap(
  config.openstreetmap.consumerKey,
  config.openstreetmap.consumerSecret,
  storage.getAuth('openstreetmap')
)
const garmin = new Garmin()

garmin.startWatching()

strava
  .on('login', auth => storage.setAuth(auth))
  .on('logout', () => storage.deleteAuth())

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
    this.state = { settings: false }
  }

  toggleSettings() {
    this.setState({settings: !this.state.settings})
  }

  render() {
    if (this.state.settings)
      return React.createElement(Settings, {
        providers: [strava]
      })
    else
      return React.createElement(TrackList, {
        tracks: this.state.tracks,
        onUploadClick: this.props.onUploadClick,
        onNameChange: this.props.onNameChange,
        onNameFocus: this.props.onNameFocus
      })
  }
}

const index = ReactDOM.render(React.createElement(Index, {
  onUploadClick: uploadTrack,
  onNameChange: onNameChange,
  onNameFocus: onNameFocus
}), document.querySelector('.content'))

document.querySelector('.navbar-settings').onclick = (event) => {
  event.preventDefault()
  index.toggleSettings()
}
garmin.on('update', renderTracks)
storage.on('change', renderTracks)

function uploadTrack(trackPath) {
  const track = storage.updateTrack(trackPath, {
    status: 'uploading',
    error: null,
    activityId: null
  })
  strava
    .uploadTrack(Object.assign({path: trackPath}, track))
    .then(status => onUploadSucces(trackPath, status))
    .catch(status => onUploadFail(trackPath, status))
}

function onNameChange(trackPath, name) {
  storage.updateTrack(trackPath, {
    name: name
  })
}

function onNameFocus(trackPath) {
  storage.updateTrack(trackPath, {
    error: null
  })
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
    error: status.error || 'Upload failed',
    activityId: null
  })
}

function renderTracks() {
  index.setState({tracks: getTracks()})
}

function getTracks() {
  if (garmin.tracks)
    return garmin.tracks
      .map(deviceTrack => [deviceTrack, storage.getTrack(deviceTrack.path)])
      .map(([deviceTrack, storageTrack]) =>
         Object.assign({
           defaultName: nameFromPath(deviceTrack.path)
         }, deviceTrack, storageTrack)
      )
}

function nameFromPath(trackPath) {
  return basename(trackPath, extname(trackPath))
}

document.body.addEventListener('click', event => {
  const a = event.target.closest('a')
  if (a && !event.defaultPrevented) {
    event.preventDefault()
    shell.openExternal(a.href)
  }
}, false)
