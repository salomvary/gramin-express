'use strict'

const React = require('react')

const DOM = React.DOM

module.exports = class LoginSetting extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = getState(this.props.provider.auth)
    this.props.provider
      .on('login', updateState.bind(this))
      .on('logout', updateState.bind(this))
  }

  render() {
    var button = DOM.button({
      className: 'track-upload-button',
      onClick: () => {
        if (this.state.isLoggedIn) {
          this.props.provider.logout()
        } else {
          this.props.provider.login()
        }
      },
      children: this.state.isLoggedIn ? 'Sign out' : 'Sign in'
    })
    return (
      DOM.tr(null,
        DOM.td({className: ''}, 'Strava'),
        DOM.td({className: ''}, this.state.userName),
        DOM.td({className: 'actions'}, button))
    )
  }
}

function updateState() {
  this.setState(getState(this.props.provider.auth))
}

function getState(auth) {
  if (auth) {
    const userName = auth.userName
    return {
      isLoggedIn: true,
      userName
    }
  } else
    return {
      isLoggedIn: false,
      userName: null
    }
}
