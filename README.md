# DrugGuardianPro
## Steps to wrap the website in an Electron application:
1- Open the terminal, navigate into the project directory, and run the following line:

    npm init -y
2- Install Electron as a development dependency in your project:

    npm install electron --save-dev
3- Create the following files in the root of the project directory:
- main.js
- preload.js
- package.json

4- main.js:

const { app, BrowserWindow } = require('electron');

const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets', 'img', 'drug.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

5- preload.js:

window.addEventListener('DOMContentLoaded', () => {
  // Code to run before renderer process
});

6- package.json:

{

  "name": "drugguardianpro",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
    
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "electron": "^31.0.2"
    
  }
}

7- Open the terminal, and run the following line:

    npm start



