require('./server');
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const path = require('path')
const url = require('url')
let mainWindow, looadingwindow

function createWindow() {
  const {
    BrowserWindow
  } = require('electron')
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false
  })
  modalPath = path.join('file://', __dirname, '/startpage.html')
  win.loadURL(modalPath);
  setTimeout(
  function()
  {
    win = null;
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800
    })
    mainWindow.loadURL('http://localhost:3007');
    mainWindow.on('closed', function() {
      mainWindow = null
    })
  }, 5000);


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
