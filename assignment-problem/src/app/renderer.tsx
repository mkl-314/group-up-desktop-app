import * as ReactDOM from "react-dom";
import * as React from "react";
import { Dashboard } from "./components/Dashboard";
import Import from "./components/Import";
import ImportGroupsFC from "./components/ImportGroupsFC";
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
    <ImportGroupsFC />
  </ThemeSwitcherProvider>,
  document.getElementById("importGroups")
);
