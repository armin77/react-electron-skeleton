const electron = require('electron');
const { ipcMain } = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      // To be able to use IPCRenderer in react
      // @SEE https://stackoverflow.com/a/56095485/4255506
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on('closed', () => (mainWindow = null));
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Aynchronous Message
ipcMain.on('getTestMessage', (event, arg) => {
  event.reply('replyTestMessage', 'message');
});

// Synchronous Message
ipcMain.on('getTestMessage', (event, arg) => {
  event.returnValue = 'message';
});
