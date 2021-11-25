const { ConnectionBuilder } = require("electron-cgi");
const project = ["dotnet", "run", "--project", "../group-up-backend/GroupUpBackend"]; // Use when editing back end
const resolve = require("path").resolve;
const exePath = resolve("./dist/backend/GroupUpBackend.exe"); // published back end executable

export function setUpConnection() {
  let connection = new ConnectionBuilder().connectTo(exePath).build();
  connection.onDisconnect = () => {
    console.log("lost");
    setUpConnection();
  };
  return connection;
}
