const url = require("url");
const path = require("path");
const contextMenu = require("electron-context-menu");
import { app, BrowserWindow, shell } from "electron";

let window: BrowserWindow | null;

contextMenu({
  prepend: (defaultActions: any, parameters: any, browserWindow: any) => [
    {
      label: "Rainbow",
      // Only show it when right-clicking images
      visible: parameters.mediaType === "image",
    },
    {
      label: "Search Google for “{selection}”",
      // Only show it when right-clicking text
      visible: parameters.selectionText.trim().length > 0,
      click: () => {
        shell.openExternal(
          `https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`
        );
      },
    },
  ],
});

const createWindow = () => {
  window = new BrowserWindow({
    fullscreen: true,
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
