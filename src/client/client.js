import "./client.scss";
import React from "react";
import ReactDOM from "react-dom";

console.log("Application starting...");

function main(){
    const routes = require("./routes").default();
    ReactDOM.render(routes, document.getElementById("app"));
}

main();

if(module.hot){
    module.hot.accept("./component/app", function(){
        main();
    });
}