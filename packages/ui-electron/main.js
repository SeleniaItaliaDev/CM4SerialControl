const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window, but not resizeable
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
    resizable: false,
    kiosk: isDev ? false : true, // kiosk mode in production
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173'); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, 'serialcontrol-ui', 'dist', 'index.html'));
  }
  
  // Hide pointer if you want:
  !isDev && win.webContents.on('dom-ready', () => win.webContents.insertCSS('html,body{cursor:none !important;}'));
  isDev && win.webContents.openDevTools();
}

app.commandLine.appendSwitch('disable-gpu');
app.whenReady().then(createWindow);