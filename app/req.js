'use strict'

const request = require('request')

module.exports = function req(options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      const isSuccess = response && response.statusCode >= 200 && response.statusCode < 300
      logReq(options, isSuccess, response, body || error)
      if (!error && isSuccess)
        resolve(body)
      else
        reject(body || error || response.statusCode)
    })
  })
}

function logReq(options, isSuccess, response, result) {
  const level = isSuccess ? 'log' : 'error'
  const summary = `${options.method || 'GET'} ${options.url} ${response && response.statusCode} body: %o oauth: %o`
  console[level](summary, result, options.oauth)
}

