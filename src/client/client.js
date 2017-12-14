import "./client.scss";

import React from "react";
import ReactDOM from "react-dom";
import {Router, browserHistory as history} from "react-router";
import {StoreProvider} from './lib/component';
import * as Actions from "./actions";
import {Dispatcher} from "shared/dispatcher";
import createStores from "./stores";

// ----------------------------
// Services
const dispatcher = new Dispatcher();
const services = {dispatcher};


// ----------------------------
// Stores
const stores = createStores(services);


// ----------------------------
// Render
function main() {
    const routes = require("./routes").default();
    ReactDOM.render(
        <StoreProvider stores={stores} services={services}>
            <Router history={history}>
                {routes}
            </Router>
        </StoreProvider>,
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

