const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  writeFile:      (options) => ipcRenderer.invoke('write-file', options),
  readFile:       (options) => ipcRenderer.invoke('read-file', options),
});
