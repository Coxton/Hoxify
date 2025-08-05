// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api', {

    setSpotifyCredentials: (credentials) => ipcRenderer.invoke('setSpotifyCredentials', credentials),
    isConnected: () => ipcRenderer.invoke('spotify:isConnected'),
    unlink: () => ipcRenderer.invoke('spotify:unlink'),
    //getCurrentTrack: () => ipcRenderer.invoke('spotify:getCurrentTrack'),
  });
