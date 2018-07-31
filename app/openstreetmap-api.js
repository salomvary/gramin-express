'use strict'

const OAuthAuthorizer = require('./oauth-authorizer')
const OAuthApi = require('./oauth-api')
const req = require('./req')

const baseUrl = 'http://master.apis.dev.openstreetmap.org'

/**
 * http://wiki.openstreetmap.org/wiki/API_v0.6
 */
module.exports = class OpenstreetmapApi extends OAuthApi {
  constructor(consumerKey, consumerSecret, auth) {
    super(new OAuthAuthorizer(consumerKey, consumerSecret))
  }

  /**
   * http://wiki.openstreetmap.org/wiki/API_v0.6#Details_of_a_user
   */
  getUserName() {
    return this.authorizer.req({
      baseUrl: baseUrl,
      method: 'GET',
      url: '/api/0.6/user/details'
    }).then(parseDisplayName)
  }

  sendFile(track) {
    const formData = {
      file: track.path, // FIXME
      description: track.name || 'FIXME',
      visibility: 'private'
    }
    return this.authorizer.xhr({
      method: 'POST',
      path: '/api/0.6/gpx/create',
    })
    sendFile(this.auth.access_token, track)
  }
}

function parseDisplayName(responseBody) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(responseBody, 'application/xml')
  const user = doc.getElementsByTagName('user')[0]
  return user.getAttribute('display_name')
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
