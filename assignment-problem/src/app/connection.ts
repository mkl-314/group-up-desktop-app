const { ConnectionBuilder } = require("electron-cgi");

exports.connection = new ConnectionBuilder()
  .connectTo("dotnet", "run", "--project", "../Core/Core")
  .build();
