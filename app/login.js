'use strict'

module.exports = class Login {
  constructor(strava) {
    this.strava = strava
    this.login = document.querySelector('.navbar-user')
    this.userName = document.querySelector('.navbar-user-name')

    document
      .querySelector('.navbar-log-out')
      .onclick = this.onLogoutClick.bind(this)

    strava
      .on('login', () => this.render())
      .on('logout', () => this.render())
  }

  onLogoutClick(event) {
    event.preventDefault()
    this.strava.logout()
  }

  render() {
    if (this.strava.auth) {
      const userName = this.strava.auth.athlete.firstname + ' ' +
        this.strava.auth.athlete.lastname
      this.userName.textContent = userName
      this.login.classList.remove('logged-out')
    } else {
      this.userName.textContent = ''
      this.login.classList.add('logged-out')
    }
  }
}
