"use strict";

// Import parts of electron to use
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const shell = require("shelljs");
const config = require("electron-json-config");

const { expressApp } = require("./services/FingerPrint");
const { Bluetooth } = require("./services/Bluetooth");
const { Check } = require("./services/Adb");

shell.config.execPath = "/usr/local/bin/node";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  dev = true;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

function initValues() {
  if (!config.has("finger.enable")) {
    config.set("finger.enable", true);
    config.set("finger.port", 3715);
  }
  if (!config.has("configs.enable")) {
    config.set("configs.enable", true);
  }
  if (!config.has("bluetooth.enable")) {
    config.set("bluetooth.enable", false);
  }
  if (!config.has("wire.enable")) {
    config.set("wire.enable", false);
  }
  if (!config.has("configs.delay")) {
    config.set("configs.delay", 30);
  }
  if (!config.has("configs.lock_command")) {
    config.set(
      "configs.lock_command",
      "SESSION=$(loginctl list-sessions | grep $(whoami) | awk '{print $1}'); loginctl lock-session $SESSION"
    );
  }
  if (!config.has("configs.unlock_command")) {
    config.set(
      "configs.unlock_command",
      "SESSION=$(loginctl list-sessions | grep $(whoami) | awk '{print $1}'); loginctl unlock-session $SESSION"
    );
  }
}

function finger() {
  if (config.get("finger.enable")) {
    let port = config.get("finger.port");
    expressApp(port);
  }
}

function bluetooth() {
  let enable = config.get("bluetooth.enable");
  if (enable) {
    const mac = config.get("bluetooth.mac");
    const delay = config.get("configs.delay");
    Bluetooth(mac, delay * 1000); //s to ms
  }
}

function wire() {
  let enable = config.get("wire.enable");
  if (enable) {
    const uuid = config.get("wire.uuid");
    const delay = config.get("configs.delay");
    Check(uuid, delay * 1000); //s to ms
  }
}

function initWin() {
  initValues();
  if (config.get("configs.enable")) {
    finger();
    wire();
    bluetooth();
  }
}

function createWindow() {
  initWin();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 768,
    icon: `${__dirname}/assets/icon.png`,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  let indexPath;

  if (dev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open the DevTools automatically if developing
    if (dev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
