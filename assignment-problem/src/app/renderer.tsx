import * as ReactDOM from "react-dom";
import * as React from "react";
import ImportStudents from "./components/ImportStudents";
import "@fontsource/staatliches";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
const resolve = require("path").resolve;

const themes = {
  dark: resolve("./src/app/dark-theme.scss"),
  light: resolve("./src/app/light-theme.scss"),
};
// console.log(resolve("dark-theme.scss"));
// console.log(resolve("../dark-theme.scss"));
// console.log(resolve("./src/app/dark-theme.scss"));
ReactDOM.render(<ImportStudents />, document.getElementById("importGroups"));
