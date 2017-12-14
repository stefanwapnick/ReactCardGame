import "./game.scss";
import React from "react";
import {ContainerBase} from "../lib/component";

export class GameContainer extends ContainerBase {
    render(){
        return (
            <p>Game!</p>
        );
    }
}

export class GameSidebar extends ContainerBase{
    render(){
        return (
            <p>Game sidebar!</p>
        );
    }
}