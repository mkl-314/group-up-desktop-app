
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {Dashboard} from "./components/Dashboard";

const { ConnectionBuilder } = require("electron-cgi");
ReactDOM.render(<Dashboard />, document.getElementById('renderer'));

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