import * as ReactDOM from "react-dom";
import * as React from "react";
import "@fontsource/staatliches";
import { Titlebar, Color } from "custom-electron-titlebar";
import { App } from "./components/App";

// new Titlebar({
//   backgroundColor: Color.fromHex("#1f1f1f"),
// });
ReactDOM.render(<App />, document.getElementById("importGroups"));
