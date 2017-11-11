'use strict'

const LoginSetting = require('./login-setting')
const React = require('react')

const DOM = React.DOM

module.exports = function Settings({ providers }) {
  return (
    DOM.table(null,
      DOM.tbody(null, providers.map(provider => {
        return React.createElement(LoginSetting, { provider })
      })))
  )
}
