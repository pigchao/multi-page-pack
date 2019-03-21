import "../../../isomorphism/polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Index from "./components/Index";
import "./assets/style/index.less";

ReactDOM.render(<Index />, document.getElementById("app"));
