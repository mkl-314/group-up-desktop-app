import * as ReactDOM from "react-dom";
import * as React from "react";
import { Dashboard } from "./components/Dashboard";
import Import from "./components/Import";
import ImportGroups from "./components/ImportGroups";
import ImportGroupsFC from "./components/ImportGroupsFC";

//ReactDOM.render(<Dashboard />, document.getElementById("renderer"));
ReactDOM.render(<ImportGroupsFC />, document.getElementById("importGroups"));
//ReactDOM.render(<Import />, document.getElementById("import"));
