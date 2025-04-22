const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const { sendLedCommand } = require('./serial.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('led-control', async (_, on) => {
  return await sendLedCommand(on);
});
