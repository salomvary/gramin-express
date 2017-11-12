'use strict'

const request = require('request')

module.exports = function req(options) {
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

