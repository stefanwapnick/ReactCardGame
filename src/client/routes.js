import React from "react";
import {Route, IndexRoute, Redirect} from "react-router";

import AppContainer from "./components/app";
import {LobbyContainer, LobbySidebar} from "./components/lobby";
import {GameContainer, GameSidebar} from "./components/game";

export default function() {
    return (
        <Route path="/" component={AppContainer}>
            <IndexRoute components={{main: LobbyContainer, sidebar: LobbySidebar}} />
            <Route path="/game/:gameId" components={{main: GameContainer, sidebar: GameSidebar}} />
            <Redirect from="*" to="/" />
        </Route>
    );
}