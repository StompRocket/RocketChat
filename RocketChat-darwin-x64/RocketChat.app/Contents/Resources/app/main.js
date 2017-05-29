require('./server');
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const path = require('path')
const url = require('url')
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800
  })
  mainWindow.loadURL('http://localhost:3007');
  mainWindow.on('closed', function() {
    mainWindow = null
  })
}
app.on('ready', createWindow)
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow()
  }
})
