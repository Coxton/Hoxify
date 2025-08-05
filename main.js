const { app, BrowserWindow, ipcMain, shell }  = require('electron');
const { setSpotifyCredentials, startServer }  = require('./services/spotify-auth-server');
const path                                    = require('node:path');
const fs                                      = require('fs');
const spotify                                 = require('./services/spotify');
const tokenPath                               = path.join(__dirname, './config/spotify_tokens.json');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 400,
    'minHeight': 650,
    'minWidth' : 1200,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function isSpotifyConnected(){
  try {

    const data = fs.readFileSync(tokenPath, 'utf-8');
    const parsed = JSON.parse(data);
    return !!parsed.access_token;

  } catch(err) {

    return false;

  }
}

function unlinkSpotify(){
  try {
    if (fs.existsSync(tokenPath)) {
      fs.unlinkSync(tokenPath);
      console.log('Unlinked Spotify');
    }
  } catch (err) {
    console.error('Failed to unlink', err.message);
  }
}


ipcMain.handle('spotify:isConnected', () => {
  return isSpotifyConnected();
});

ipcMain.handle('spotify:unlink', () => {
  unlinkSpotify();
  return true;
});

ipcMain.handle('setSpotifyCredentials', async(event, {clientId, clientSecret}) =>{
  spotify.storeCredentials(clientId, clientSecret);

  

  setSpotifyCredentials(clientId, clientSecret);

  startServer();


  const authUrl = spotify.getAuthorizationUrl();
  shell.openExternal(authUrl);

  return true;
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
