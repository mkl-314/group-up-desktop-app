import * as ReactDOM from "react-dom";
import * as React from "react";
import ImportStudents from "./components/ImportStudents";
import "@fontsource/staatliches";
import { Titlebar, Color } from "custom-electron-titlebar";
import { shell } from "electron";
import { Footer } from "./components/Footer";
// const contextMenu = require("electron-context-menu");

new Titlebar({
  backgroundColor: Color.fromHex("#1f1f1f"),
});

// contextMenu({
//   prepend: (defaultActions: any, parameters: any, browserWindow: any) => [
//     {
//       label: "Rainbow",
//       // Only show it when right-clicking images
//       visible: parameters.mediaType === "image",
//     },
//     {
//       label: "Search Google for “{selection}”",
//       // Only show it when right-clicking text
//       visible: parameters.selectionText.trim().length > 0,
//       click: () => {
//         shell.openExternal(
//           `https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`
//         );
//       },
//     },
//   ],
// });
ReactDOM.render(<ImportStudents />, document.getElementById("importGroups"));
ReactDOM.render(<Footer />, document.getElementById("footer"));
