const { ConnectionBuilder } = require("electron-cgi");
// const full =
//   "C:/Users/18lowmk/Documents/GitHub/assignment-problem-frontend/Core/Core/bin/Release/net5.0/win-x64/publish/Core.exe";
// const move = "C:/Users/18lowmk/Documents/GitHub/assignment-problem-frontend/Core/Core.exe";
const project = ["dotnet", "run", "--project", "../Core/Core"];
const resolve = require("path").resolve;
const exe = resolve("../Core/Core.exe");
// console.log(resolve("../Core/Core.exe"));
export function setUpConnection() {
  let connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "../Core/Core")
    .build();
  connection.onDisconnect = () => {
    console.log("lost");
    setUpConnection();
  };
  return connection;
}
