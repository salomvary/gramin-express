'use strict'

const electron = require('electron')
const menu = require('./menu')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

var mainWindow = null

app.on('window-all-closed', function() {
  app.quit()
})

app.on('ready', function() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    minWidth: 600,
    minHeight: 500
  })
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.on('closed', function() {
    mainWindow = null
  })
})
