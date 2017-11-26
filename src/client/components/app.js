import "./app.scss";

import React from "react";

class AppContainer extends React.Component {
    componentDidMount() {
        console.log("HEY THERE");
    }

    render() {
        return (
            <section>
                <h1>Hello World</h1>
                <button onClick={this._click.bind(this)}>I am button click me</button>
            </section>
        );
    }

    _click() {
        console.log("STUFweaweF");
    }
}

export default AppContainer;