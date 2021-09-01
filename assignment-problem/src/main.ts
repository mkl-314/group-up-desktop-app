const url = require("url");
const path = require("path");
import { app, BrowserWindow } from "electron";
const contextMenu = require("electron-context-menu");
let window: BrowserWindow | null;

contextMenu();

const createWindow = () => {
  window = new BrowserWindow({
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

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
