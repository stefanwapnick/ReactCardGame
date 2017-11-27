import "./app.scss";

import React from "react";

class AppContainer extends React.Component {

    render() {

        const {main, sidebar} = this.props;

        return (
            <div className={`c-application`}>
                <div className="inner">
                    <div className="sidebar">{sidebar}</div>
                    <div className="main">{main}</div>
                </div>
            </div>
        );
    }
}

export default AppContainer;