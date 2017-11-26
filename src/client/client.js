import "./client.scss";

import ReactDOM from "react-dom";

function main() {
    const routes = require("./routes").default();
    ReactDOM.render(routes, document.getElementById("app"));
}

main();

if (module.hot) {
    module.hot.accept("./routes", () => {
        main();
    });
}