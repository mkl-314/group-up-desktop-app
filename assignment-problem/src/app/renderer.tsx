import * as ReactDOM from "react-dom";
import * as React from "react";
import { Dashboard } from "./components/Dashboard";
import Import from "./components/Import";
import ImportGroups from "./components/ImportGroups";
import ImportGroupsFC from "./components/ImportGroupsFC";

const { ConnectionBuilder } = require("electron-cgi");
ReactDOM.render(<Dashboard />, document.getElementById("renderer"));
ReactDOM.render(<ImportGroupsFC />, document.getElementById("importGroups"));
ReactDOM.render(<Import />, document.getElementById("import"));

// let connection = new ConnectionBuilder()
// .connectTo("dotnet", "run", "--project", "../Core/")
// .build();

// connection.onDisconnect = () => {
//     console.log("lost");
//     connection = new ConnectionBuilder().connectTo('dotnet', 'run', '--project', "../Core/").build();
// };

// connection.send('greeting', 'John', (error: any, response: any) => {
//     if (error) {
//         console.log(error); //serialized exception from the .NET handler
//         return;
//     }
//     console.log("This is not the response");
//     document.getElementById('title').innerText = response;

// });
