const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
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
}

app.commandLine.appendSwitch('disable-gpu');
app.whenReady().then(createWindow);