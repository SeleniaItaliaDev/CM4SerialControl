const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process'); // <--- Importa exec

const isDev = process.env.NODE_ENV === 'development';

// Funzione per configurare la camera a livello driver
function configureCamera() {
  // Comandi V4L2 per ridurre la scia (Motion Blur)
  // NOTA: I valori 'exposure_absolute' vanno calibrati in base alla tua luce
  const commands = [
    'v4l2-ctl -d /dev/video0 --set-ctrl=exposure_auto=1',         // Disabilita esposizione automatica
    'v4l2-ctl -d /dev/video0 -c --set-ctrl=exposure_absolute=200', // Tempo esposizione basso (FISSO)
    'v4l2-ctl -d /dev/video0 -c gain=30',           // Alza il gain se è buio (opzionale)
    'v4l2-ctl -d /dev/video0 -p 30'                    // Forza 30 FPS lato driver
  ];

  commands.forEach(cmd => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) console.error(`Errore camera config: ${error.message}`);
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
    resizable: false,
    kiosk: !isDev,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false, // Per sicurezza meglio false
      contextIsolation: true, // Per sicurezza meglio true
      preload: path.join(__dirname, 'preload.js'), // Se ti serve comunicare tra front e back
      backgroundThrottling: false,
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'serialcontrol-ui', 'dist', 'index.html'));
  }

  !isDev && win.webContents.on('dom-ready', () => {
    win.webContents.insertCSS('* { cursor: none !important; }');
  });
  
  // Applica la configurazione Hardware della camera
  configureCamera();
}

// Flags Ottimizzati per Video
// Vaapi è spesso per Intel. Su Pi 4/5 meglio puntare su queste:
app.commandLine.appendSwitch('enable-features', 'WebRtcPipeWireCapturer'); 
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-gpu-memory-buffer-video-frames'); // A volte aiuta su Pi
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.whenReady().then(createWindow);