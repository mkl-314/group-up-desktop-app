const { ConnectionBuilder } = require("electron-cgi");
const project = ["dotnet", "run", "--project", "../group-up-backend/GroupUpBackend"];
const resolve = require("path").resolve;
const exePath = resolve("./dist/backend/Core.exe"); // executable file will be renamed

export function setUpConnection() {
  let connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "../group-up-backend/GroupUpBackend")
    .build();
  connection.onDisconnect = () => {
    console.log("lost");
    setUpConnection();
  };
  return connection;
}
