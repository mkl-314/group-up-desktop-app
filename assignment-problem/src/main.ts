const url = require("url");
const path = require("path");
import { app, BrowserWindow, shell } from "electron";
require("@electron/remote/main").initialize();

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    show: false,
    //titleBarStyle: "hidden",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  // window.setIcon();
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  window.on("closed", () => {
    window = null;
  });

  window.maximize();
  window.show();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});
