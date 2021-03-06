import "./lobby.scss";
import React from "react";
import * as Actions from "../actions";
import Chat from "./chat";
import {ContainerBase} from "../lib/component";

export class LobbyContainer extends ContainerBase{

    constructor(props){
        super(props);

        // this.gameJoin = (game) => {
        //     console.log("TODO: Implement join game" + game.id);
        // };

        // this.sendMessage = (message) => {
        //     console.log(message);
        // };

        this.joinGame = (game) => this.request(Actions.gameJoin(game.id));
        this.sendMessage = (message) => this.request(Actions.lobbySendMessage(message));
    }

    componentWillMount(){
        const {stores: {lobbyStore, appStore}} = this.context;

        this.subscribe(lobbyStore.opSendMessage$, opSendMessage => this.setState({opSendMessage}));
        this.subscribe(lobbyStore.view$, lobby => this.setState({lobby}));
        this.subscribe(appStore.reconnected$, () => this.request(Actions.lobbyJoin()));

        this.request(Actions.lobbyJoin());
    }

    render(){

        // const games = [
        //     {title: "Game1", id: 1, players: ["one, two, three"]},
        //     {title: "Game2", id: 2, players: ["one, two, three"]},
        //     {title: "Game3", id: 3, players: ["one, two, three"]},
        //     {title: "Game4", id: 4, players: ["one, two, three"]},
        //     {title: "Game5", id: 5, players: ["one, two, three"]}
        // ];

        //const opSendMessage = {can: true, isProgress: false};
        // const messages = [
        //     {index: 1, name: "Person", message: "Message1"},
        //     {index: 2, name: "Person", message: "Message2"},
        //     {index: 3, name: "Person", message: "Message3"},
        //     {index: 4, name: "Person", message: "Message4"},
        //     {index: 5, name: "Person", message: "Message5"}
        // ];

        const {lobby: {games, messages}, opSendMessage} = this.state;

        return (
            <div className="c-lobby">
                <GameList games={games} joinGame={this.joinGame}/>
                <Chat messages={messages} opSendMessage={opSendMessage} sendMessage={this.sendMessage}/>
            </div>
        );
    }
}

export class LobbySidebar extends ContainerBase{

    constructor(props){
        super(props);

        this.login = () => this.dispatch(Actions.dialogSet(Actions.DIALOG_LOGIN, true));
        this.createGame = () => this.request(Actions.gameCreate());
    }

    componentWillMount(){
        const {stores: {userStore, gameStore}} = this.context;
        this.subscribe(userStore.opLogin$, opLogin => this.setState({opLogin}));
        this.subscribe(gameStore.opCreateGame$, opCreateGame => this.setState({opCreateGame}));
    }

    render(){

        const {opLogin, opCreateGame} = this.state;

        return (
            <section className="c-lobby-sidebar">
                <div className="m-sidebar-buttons">
                    {!opLogin.can ? null : <button className="m-button primary" onClick={this.login}>Login</button>}

                    {!opCreateGame.can ? null :
                        <button onClick={this.createGame} disabled={opCreateGame.inProgress} className="m-button good">
                            Create Game
                        </button>}

                </div>
            </section>
        );
    }
}

// Using object deconstruction to get games and join games from props immediately
function GameList({games, joinGame}){
    return(
        <section className="c-game-list">
            {games.length > 0 ? null :
                <div className="no-games">There are no games yet.</div>
            }

            {games.map(game =>
                <div className="game" key={game.id} onClick={() => joinGame(game)}>
                    <div className="title">{game.title}</div>
                    <div className="players">
                        {game.players.join(", ")}
                    </div>
                    <div className="join-game">Join game</div>
                </div>
            )}

        </section>
    );
}