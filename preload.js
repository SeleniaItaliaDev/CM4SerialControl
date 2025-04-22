import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  ledControl: (on) => ipcRenderer.invoke('led-control', on)
});
