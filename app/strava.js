'use strict'

const BrowserWindow = require('electron').remote.BrowserWindow
const Events = require('events')
const fs = require('fs')
const request = require('request')
const url = require('url')

module.exports = class Strava extends Events {
  constructor(clientId, clientSecret, auth) {
    super()
    this.authorizer = new Authorizer(clientId, clientSecret)
    this.auth = auth
  }

  uploadTrack(track) {
    return this.login()
      .then(auth => Promise.all([auth, sendFile(auth.access_token, track)]))
      .then(results => {
        const auth = results[0]
        const status = results[1]
        return checkUploadStatus(auth.access_token, status)
      })
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
        .deauthorize(this.auth.access_token)
        .then(() => this.setAuth(null))
    else
      return Promise.resolve(null)
  }
}

class Authorizer {
  constructor(clientId, clientSecret) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  authorize() {
    if (this.authorizing) {
      if (this.authorizeWindow)
        this.authorizeWindow.focus()
    } else {
      this.authorizing = this.obtainCode()
        .then(code => this.exchangeToken(code))
      this.authorizing
        .then(() => this.authorizing = null)
        .catch(() => this.authorizing = null)
    }
    return this.authorizing
  }

  deauthorize(accessToken) {
    return req({
      method: 'POST',
      url: 'https://www.strava.com/oauth/deauthorize',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
  }

  obtainCode() {
    this.authorizeWindow = new BrowserWindow({
      width: 500,
      height: 700,
      minWidth: 300,
      minHeight: 400,
      webPreferences: {
        nodeIntegration: false
      }
    })

    // TODO: open links in the login window to a new browser window

    const authorizeUrl = url.format({
      protocol: 'https',
      hostname: 'www.strava.com',
      pathname: 'oauth/authorize',
      query: {
        client_id: this.clientId,
        redirect_uri: 'http://localhost/callback',
        response_type: 'code',
        scope: 'write'
      }
    })

    this.authorizeWindow.on('closed', () => this.authorizeWindow = null)

    return new Promise((resolve, reject) => {
      function onRedirect(event, _, newURL) {
        const callback = url.parse(newURL, true)
        const host = callback.host
        const pathname = callback.pathname
        const code = callback.query.code
        const error = callback.query.error

        if (host == 'localhost' && pathname == '/callback') {
          event.preventDefault()
          // "Close event will also not be emitted for this window, but it
          // guarantees the closed event will be emitted."
          this.authorizeWindow.destroy()
          if (error)
            reject({error: error})
          else
            resolve(code)
        }
      }

      // User closed the window
      this.authorizeWindow.on('close', () => reject({error: 'Authorization cancelled'}))

      this.authorizeWindow.webContents.on('did-get-redirect-request', onRedirect.bind(this))
      this.authorizeWindow.loadURL(authorizeUrl)
    })
  }

  exchangeToken(code) {
    return req({
      method: 'POST',
      url: 'https://www.strava.com/oauth/token',
      form: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code
      }
    })
  }
}

function req(options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      // TODO handle JSON parse exception
      const json = body && JSON.parse(body)
      const isSuccess = response && response.statusCode >= 200 && response.statusCode < 300
      logReq(options, isSuccess, response, json || error)
      if (!error && isSuccess)
        resolve(json)
      else
        reject(json || error || response.statusCode)
    })
  })
}

function logReq(options, isSuccess, response, result) {
  const level = isSuccess ? 'log' : 'error'
  const summary = `${options.method || 'GET'} ${options.url} ${response && response.statusCode} body: %o`
  console[level](summary, result)
}

function sendFile(accessToken, track) {
  const formData = {
    data_type: 'gpx',
    file: fs.createReadStream(track.path)
  }
  if (track.name) formData.name = track.name
  return req({
    method: 'POST',
    url: 'https://www.strava.com/api/v3/uploads',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    formData: formData
  })
}

function checkUploadStatus(accessToken, status) {
  return new Promise((resolve, reject) => {
    if (status.activity_id)
      resolve(status)
    else if (status.error)
      reject(status)
    else
      setTimeout(() => {
        req({
          url: 'https://www.strava.com/api/v3/uploads/' + status.id,
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })
          .then(status => checkUploadStatus(accessToken, status))
          .then(resolve, reject)
      }, 1000)
  })
}
