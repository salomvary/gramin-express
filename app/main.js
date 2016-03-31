'use strict'

const electron = require('electron')
const menu = require('./menu')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

var mainWindow = null

const profile = process.env.GRAMIN_PROFILE
if (profile)
  app.setPath('userData', app.getPath('userData') + ' ' + profile)

app.on('window-all-closed', function() {
  app.quit()
})

app.on('ready', function() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  mainWindow = new BrowserWindow({
    width: 700,
    height: 500,
    minWidth: 600,
    minHeight: 500
  })
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.on('closed', function() {
    mainWindow = null
  })
})
