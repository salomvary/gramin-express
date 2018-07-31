'use strict'

const fs = require('fs')
const OAuthApi = require('./oauth-api')

module.exports = class StravaApi extends OAuthApi {
  getUserName() {
    const auth = this.authorizer.auth
    return Promise.resolve(
      auth.athlete.firstname + ' ' + auth.athlete.lastname
    )
  }

  uploadTrack(track) {
    sendFile(this.req, track)
      .then(status => checkUploadStatus(this.req, status))
  }
   
  deauthorize({accessToken}) {
    return req({
      method: 'POST',
      url: 'https://www.strava.com/oauth/deauthorize',
      json: true,
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
  }
}

function sendFile(req, track) {
  const formData = {
    data_type: 'gpx',
    file: fs.createReadStream(track.path)
  }
  if (track.name) formData.name = track.name
  return req({
    method: 'POST',
    url: 'https://www.strava.com/api/v3/uploads',
    json: true,
    formData: formData
  })
}

function checkUploadStatus(req, status) {
  return new Promise((resolve, reject) => {
    if (status.activity_id)
      resolve(status)
    else if (status.error)
      reject(status)
    else
      setTimeout(() => {
        req({
          url: 'https://www.strava.com/api/v3/uploads/' + status.id,
          json: true
        })
          .then(status => checkUploadStatus(req, status))
          .then(resolve, reject)
      }, 1000)
  })
}
