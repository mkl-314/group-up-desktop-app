const { ConnectionBuilder } = require("electron-cgi");
const project = ["dotnet", "run", "--project", "../Core/Core"];
const resolve = require("path").resolve;
const exePath = resolve("./dist/backend/Core.exe"); // resolve("backend/Core.exe");

export function setUpConnection() {
  let connection = new ConnectionBuilder().connectTo(exePath).build();
  connection.onDisconnect = () => {
    console.log("lost");
    setUpConnection();
  };
  return connection;
}
