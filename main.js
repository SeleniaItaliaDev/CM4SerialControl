const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { sendLedCommand } = require('./serial.js');
const { fileURLToPath } = require('url');
const { join } = path;

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),  // ✅ ESM-safe preload path
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);


ipcMain.handle('led-control', async (_, on) => {
  return await sendLedCommand(on);
});
