import "./client.scss";

import React from "react";
import ReactDOM from "react-dom";
import {Router, browserHistory as history} from "react-router";
import {StoreProvider} from './lib/component';
import * as Actions from "./actions";
import {Dispatcher} from "shared/dispatcher";
import createStores from "./stores";
import io from "socket.io-client";

// ----------------------------
// Services
const dispatcher = new Dispatcher();
const socket = io();
const services = {dispatcher, socket};

dispatcher.on("*", printAction);

socket.on("action", action => dispatcher.emit(action));

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

// ----------------------------
// Helpers
function printAction(action){
    if(action.hasOwnProperty("status")){

        let color = null;
        switch(action.status){
        case Actions.STATUS_REQUEST: color = "color: blue"; break;
        case Actions.STATUS_SUCCESS: color = "color: green"; break;
        case Actions.STATUS_FAIL: color = "color: red"; break;
        }

        console.log(`%c${action.type}`, `${color}; font-weight: bold; background: #eee; width: 100%; display: block;`);

    }else{
        console.log(`%c${action.type}`, `background: #ddd;`);
    }

    console.log(action);
}