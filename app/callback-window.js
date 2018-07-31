'use strict'

const BrowserWindow = require('electron').remote.BrowserWindow
const Url = require('url')

module.exports = function callbackWindow(url) {
  console.log('Opening window with url=' + url)

  let window = new BrowserWindow({
    width: 500,
    height: 700,
    minWidth: 300,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: false
    }
  })

  window.on('closed', () => window = null)

  const promise = new Promise((resolve, reject) => {
    function onRedirect(event, _, newURL) {
      const callback = Url.parse(newURL)
      const host = callback.host
      const pathname = callback.pathname

      if (host == 'localhost' && pathname == '/callback') {
        console.log('Redirected to callback query=' + callback.query)
        event.preventDefault()
        // "Close event will also not be emitted for this window, but it
        // guarantees the closed event will be emitted."
        window.destroy()
        resolve(callback.query)
      }
    }

    // User closed the window
    window.on('close', () => reject({error: 'Authorization cancelled'}))

    window.webContents.on('did-get-redirect-request', onRedirect)
    window.loadURL(url)
  })

  // Expose window.focus
  promise.focusWindow = () => {
    if (window) window.focus()
  }

  return promise
}
