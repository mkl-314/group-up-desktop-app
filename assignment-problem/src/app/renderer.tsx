import * as ReactDOM from "react-dom";
import * as React from "react";
import ImportStudents from "./components/ImportStudents";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
const resolve = require("path").resolve;

const themes = {
  dark: resolve("./src/app/dark-theme.scss"),
  light: resolve("./src/app/light-theme.scss"),
};
console.log(resolve("dark-theme.scss"));
console.log(resolve("../dark-theme.scss"));
console.log(resolve("./src/app/dark-theme.scss"));
ReactDOM.render(
  <ThemeSwitcherProvider themeMap={themes} defaultTheme="light">
    <ImportStudents />
  </ThemeSwitcherProvider>,
  document.getElementById("importGroups")
);
