import "./client.scss";

import React from "react";
import ReactDOM from "react-dom";
import {Router, browserHistory as history} from "react-router";

function main() {
    const routes = require("./routes").default();
    ReactDOM.render(
        <Router history={history}>
            {routes}
        </Router>,
        document.getElementById("app"));
}

// ----------------------------
// Go!
main();

// ----------------------------
// Hot reloading
if (module.hot) {
    module.hot.accept("./routes", () => {
        main();
    });
}

