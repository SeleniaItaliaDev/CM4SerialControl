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
      backgroundThrottling: false,
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173'); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, 'serialcontrol-ui', 'dist', 'index.html'));
  }

  // Hide pointer if you want:
  !isDev && win.webContents.on('dom-ready', (event) => {
    let css = '* { cursor: none !important; }';
    win.webContents.insertCSS(css);
  });
  isDev && win.webContents.openDevTools();
}

// app.commandLine.appendSwitch('disable-gpu');
// Su Linux/Raspberry, a volte è necessario passare flag hardware a Chromium
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder'); // Accelerazione hardware
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy'); // Riduce la latenza copiando meno dati in memoria

app.whenReady().then(createWindow);
app.whenReady().then(createWindow);