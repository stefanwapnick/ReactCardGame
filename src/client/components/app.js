import "./app.scss";

import React from "react";
import dialogTypes from "./dialogs";
import * as Actions from "../actions";
import {ContainerBase} from "../lib/component";

class AppContainer extends ContainerBase {

    componentWillMount(){
        const {stores: {appStore}, services: {dispatcher}} = this.context;
        const {router} = this.props;

        // Whenever observable changes, re-set state and re-render component
        this.subscribe(appStore.dialogs$, dialogs => this.setState({dialogs: dialogs}));

        this.subscribe(dispatcher.onSuccess$(Actions.GAME_JOIN), action => {
            const path = `/game/${action.gameId}`;
            if(path === router.location.pathname)
                return;

            // Navigate to game path
            router.push(path);
        });

        this.subscribe(dispatcher.onSuccess$(Actions.LOBBY_JOIN), () => {
            if(router.location.pathname === '/')
                return;

            // Navigate to game lobby
            router.push('/');
        });
    }

    render() {

        const {main, sidebar} = this.props;
        const {dialogs} = this.state;

        const dialogStack = dialogs.map(dialog => {
            const DialogComponent = dialogTypes[dialog.id];
            return <DialogComponent {...dialog.props} key={dialog.id}/>;
        });

        return (
            <div className={`c-application ${dialogStack.length ? "dialogs-open" : "dialogs-closed"}`}>
                <div className="dialogs">
                    {dialogStack}
                </div>
                <div className="inner">
                    <div className="sidebar">{sidebar}</div>
                    <div className="main">{main}</div>
                </div>
            </div>
        );
    }
}

export default AppContainer;