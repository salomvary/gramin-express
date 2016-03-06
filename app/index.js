'use strict'

const config = require('./config')
const Garmin = require('./garmin')
const Login = require('./login')
const Storage = require('./storage')
const Strava = require('./strava')
const TrackList = require('./track-list')

const clientId = config.clientId
const clientSecret = config.clientSecret

const storage = new Storage()
const strava = new Strava(clientId, clientSecret, storage.getAuth())
const garmin = new Garmin()
const trackList = new TrackList(strava, garmin, storage)
const login = new Login(strava)

trackList.render()
login.render()
garmin.startWatching()

strava
  .on('login', auth => storage.setAuth(auth))
  .on('logout', () => storage.deleteAuth())
