const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  print: (payload) => ipcRenderer.invoke('printer:print', payload),
  printPdf: (payload) => ipcRenderer.invoke('printer:printPdf', payload),
  printRaw: (payload) => ipcRenderer.invoke('printer:printRaw', payload),
  testTspl: (payload) => ipcRenderer.invoke('printer:testTspl', payload),
  listPrinters: () => ipcRenderer.invoke('printer:list'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (_event, info) => callback(info)),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', (_event, info) => callback(info)),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (_event, p) => callback(p)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (_event, info) => callback(info)),
  onUpdateError: (callback) => ipcRenderer.on('update-error', (_event, err) => callback(err)),
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  downloadUpdate: () => ipcRenderer.invoke('updater:download'),
  installUpdate: () => ipcRenderer.invoke('updater:install'),
})
