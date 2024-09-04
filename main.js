const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require("electron-updater");

let win;

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

function sendMessage(obj) {
  win.webContents.send('message', obj);
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.webContents.openDevTools();

  win.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
}

autoUpdater.on('checking-for-update', () => {
  sendMessage({ 'msg': 'checking for update...' });
});

autoUpdater.on('update-available', (info) => {
  sendMessage({ 'msg': 'Update Available' });
});

autoUpdater.on('update-not-available', (info) => {
  sendMessage({ 'msg': 'Update Not Available' });
});

autoUpdater.on('error', (err) => {
  sendMessage({
    'msg': 'Error',
    'error': err
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  sendMessage({
    'msg':'progress',
    'speed': progressObj.bytesPerSecond,
    'dlpercent': progressObj.percent,
    'transfered': progressObj.transferred,
    'total': progressObj.total
  });
})

autoUpdater.on('update-downloaded', (info) => {
  sendMessage('Update downloaded; will install now.');
  autoUpdater.quitAndInstall(true, true);
});

ipcMain.on("Update_app", function (event, data) {
  sendMessage("Downloading Update...");
  autoUpdater.downloadUpdate();
});

app.on("ready", function () {
  createWindow();
  ipcMain.on("Check_Update", function (event, data) {
    autoUpdater.checkForUpdates();
  });
})


app.on('window-all-closed', () => {
  app.quit();
});


