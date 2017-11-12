'use strict'

const Oauth2Provider = require('./oauth2-provider')
const req = require('./req')

module.exports = class Strava extends Oauth2Provider {
  uploadTrack(track) {
    super.uploadTrack(track)
      .then(status => checkUploadStatus(this.auth.access_token, status))
  }
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
