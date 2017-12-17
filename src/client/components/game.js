import "./game.scss";
import React from "react";
import {ContainerBase} from "../lib/component";
import * as Actions from "../actions";
import GameBoard from "./game/game-board";
import GameSetup from "./game/game-setup";
import Chat from "./chat";

export class GameContainer extends ContainerBase {

    constructor(props){
        super(props);

        this._sendMessage = message => this.request(Actions.gameSendMesssage(this.state.game.id, message));
    }

    componentWillMount(){
        const {stores: {appStore, gameStore}} = this.context;
        const {params} = this.props;
        const gameId = parseInt(params.gameId);

        this.subscribe(gameStore.opJoinGame$, opJoinGame => this.setState({opJoinGame}));
        this.subscribe(gameStore.opSendMessage$, opSendMessage => this.setState({opSendMessage}));
        this.subscribe(gameStore.view$, game => this.setState({game}));
        this.subscribe(appStore.reconnected$, () => this.request(Actions.gameJoin(gameId)));
        this.request(Actions.gameJoin(gameId));
    }

    render(){

        const {opJoinGame, opSendMessage, game} = this.state;
        let body = null;
        let showChat = true;

        if(opJoinGame.inProgress){
            body = <section className="notice"><p>Joining game...</p></section>;
            showChat = false;
        }else if(opJoinGame.error){
            body = <section className="notice error"><p>Cannot join game: {opJoinGame.error}</p></section>;
            showChat = false;
        }else if(game.step === Actions.STEP_DISPOSED){
            body = <section className="notice error"><p>Game doesn't exist</p></section>;
            showChat = false;
        }else if(game.step === Actions.STEP_SETUP){
            body = <GameSetup/>;
        }else{
            body = <GameBoard/>;
        }

        return (
            <div className="c-game">
                {body}
                {!showChat ? null :
                    <Chat messages={game.messages} opSendMessage={opSendMessage} sendMessage={this._sendMessage}/>
                }
            </div>
        );
    }
}

// Use object deconstruction to get players from props
function PlayerList({players}){
    return (
        <ul className="c-player-list">
            {players.map(p => {
                const [cls, status] = getPlayerStatus(p);
                return (
                    <li key={p.id} className={cls}>
                        <div className="details">
                            <div className="name">{p.name}</div>
                            <div className="score">
                                {p.score}
                                {p.score === 1 ? " point": " points"}
                            </div>
                        </div>
                        <div className="status">{status}</div>
                    </li>
                );
            })}
        </ul>

    );
}

function getPlayerStatus({isCzar, isWinner, isPlaying}){
    if (isCzar) return ["is-czar", "czar"];
    if (isWinner) return ["is-winner", "winner!"];
    if (isPlaying) return ["is-playing", "playing"];
    return ["", ""];
}



export class GameSidebar extends ContainerBase{

    constructor(props){
        super(props);

        this._exitGame = () => this.props.router.push('/');
        this._login = () => this.dispatcher(Actions.dialogSet(Actions.DIALOG_LOGIN, true));
    }

    componentWillMount(){
        const {stores: {userStore, gameStore}} = this.context;
        this.subscribe(userStore.opLogin$, opLogin => this.setState({opLogin}));
        this.subscribe(gameStore.view$, game => this.setState({game}));
    }

    render(){

        const {opLogin, game} = this.state;

        return (
            <section className="c-game-sidebar">
                <div className="m-sidebar-buttons">
                    {!opLogin.can ? null :
                        <button className="m-button- primary" onClick={this._login}>
                            Login to join game
                        </button>}

                    <button className="m-button" onClick={this._exitGame}>Leave game</button>
                </div>

                {game.step === Actions.STEP_DISPOSED ? null :
                    <PlayerList players={game.players}/>}

            </section>
        );
    }
}