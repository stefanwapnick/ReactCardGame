import "./lobby.scss";
import React from "react";
import Chat from "./chat";
import TextInput from "./controls";

export class LobbyContainer extends React.Component{

    constructor(props){
        super(props);

        this.joinGame = (game) => {
            console.log("TODO: Implement join game");
        };
    }

    render(){

        const games = [
            {title: "Game1", id: 1, players: ["one, two, three"]},
            {title: "Game2", id: 2, players: ["one, two, three"]},
            {title: "Game3", id: 3, players: ["one, two, three"]},
            {title: "Game4", id: 4, players: ["one, two, three"]},
            {title: "Game5", id: 5, players: ["one, two, three"]}
        ];

        return (
            <div className="c-lobby">
                <GameList games={games} joinGame={this.joinGame}/>
                <TextInput/>
            </div>
        );
    }
}

export class LobbySidebar extends React.Component{

    constructor(props){
        super(props);

        this.login = () => {
            console.log("TODO: Implement login");
        };

        this.createGame = () => {
            console.log("TODO: Implement create game");
        };
    }

    render(){

        const canLogin = true;
        const canCreateGame = true;
        const createGameInProcess = false;

        return (
            <section className="c-lobby-sidebar">
                <div className="m-sidebar-buttons">
                    {!canLogin ? null : <button className="m-button primary" onClick={this.login}>Login</button>}

                    {!canCreateGame ? null :
                        <button onClick={this.createGame} disabled={createGameInProcess} className="m-button good">
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