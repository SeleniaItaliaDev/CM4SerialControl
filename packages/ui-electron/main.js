const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window, but not resizeable
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173'); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, 'serialcontrol-ui/dist/index.html')); // Production build
  }

  // Hide pointer if you want:
  // win.webContents.on('dom-ready', () => win.webContents.insertCSS('html,body{cursor:none !important;}'));
}

app.commandLine.appendSwitch('disable-gpu');
app.whenReady().then(createWindow);