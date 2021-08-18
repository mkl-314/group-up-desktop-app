const url = require("url");
const path = require("path");
const { ConnectionBuilder } = require("electron-cgi");

import { app, BrowserWindow } from "electron";

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
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

// let connection = new ConnectionBuilder()
//   .connectTo("dotnet", "run", "--project", "../../AssignmentProblem/AssignmentProblem/")
//   .build();

// connection.onDisconnect = () => {
//     console.log("lost");
//     connection = new ConnectionBuilder().connectTo('dotnet', 'run', '--project', "../Core/").build();
// };

//  connection.send('greeting', 'John', (error: any, response: any) => {
//     if (error) {
//         console.log(error); //serialized exception from the .NET handler
//         return;
//     }
//     window.webContents.send("greeting", response);
//     console.log(response);
//     connection.close();
// });
