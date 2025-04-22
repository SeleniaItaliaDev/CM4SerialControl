import { app, BrowserWindow, ipcMain } from 'electron';
import path, { join } from 'path';
import { sendLedCommand } from './serial.js';
import { fileURLToPath } from 'url';

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
