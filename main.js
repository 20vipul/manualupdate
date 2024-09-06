const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require("electron-updater");

let win;
var checkUpdateTimer;

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

//fired after autoUpdater.checkForUpdates();

autoUpdater.on('checking-for-update', () => {
  sendMessage({ 'msg': 'checking for update...' });
});

autoUpdater.on('update-available', (info) => {
  sendMessage({ 'msg': 'Update Available' });
  clearInterval(checkUpdateTimer)
  autoUpdater.downloadUpdate();
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

// fired after autoUpdater.downloadUpdate(); track the down load process
autoUpdater.on('download-progress', (progressObj) => {
  sendMessage({
    'msg':'progress',
    'speed': progressObj.bytesPerSecond,
    'dlpercent': progressObj.percent,
    'transfered': progressObj.transferred,
    'total': progressObj.total
  });
})

// fired afte all the updates are downloaded 
autoUpdater.on('update-downloaded', (info) => {
  sendMessage('Update downloaded; will install now.');

  //Quit the applicatin and install the updates and the relaunch the application 
  autoUpdater.quitAndInstall(true, true);
});


// ipcMain.on("Update_app", function (event, data) {
//   sendMessage("Downloading Update...");
//   // if Update sare available Starts Downloading The updates
//   autoUpdater.downloadUpdate();
// });

app.on("ready", function () {
  createWindow();
  
  autoUpdater.checkForUpdates();  

  checkUpdateTimer = setInterval(function(){
    autoUpdater.checkForUpdates();  
  },60000)

  // ipcMain.on("Check_Update", function (event, data) {

  //   // autoupdate dcheck for updates
  //   checkUpdateTimer = setInterval(function(){
  //     autoUpdater.checkForUpdates();  
  //   },60000)

  // });
})


app.on('window-all-closed', () => {
  app.quit();
});


