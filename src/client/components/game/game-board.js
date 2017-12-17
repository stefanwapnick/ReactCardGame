import "./game-board.scss";
import * as Actions from "../../actions";

import React from "react";
import {ContainerBase} from "../../lib/component";
import Card from "./card";
import PlayerHand from "./player-hand";
import Stacks from "./stacks";

const TIMER_REASONS = {
    [Actions.WAIT_GAME_OVER]: "Game over",
    [Actions.WAIT_REASON_GAME_FINISHED]: "Game finished",
    [Actions.WAIT_REASON_TOO_FEW_PLAYERS]: "Too few players",
    [Actions.WAIT_ROUND_OVER]: "Round over",
    [Actions.WAIT_REASON_CZAR_LEFT]: "The Czar left",
    [Actions.WAIT_REASON_ROUND_FINISHED]: "Round finished"
};

export default class GameBoard extends ContainerBase {

    constructor(props){
        super(props);

        this.state = {isHandOpen: false};
        this._selectCard = (card) => {
            this.request(Actions.gameSelectCard(this.state.game.id, card.id));
        };

        this._selectStack = stack => {
            this.request(Actions.gameSelectStack(this.state.game.id, stack.id));
        };

        this._toggleHand = () => {
            this.setState({isHandOpen: !this.state.isHandOpen});
        };
    }

    componentWillMount(){
        const {stores: {gameStore}} = this.context;
        this.subscribe(gameStore.view$, game => this.setState({game}));
        this.subscribe(gameStore.player$, player => this.setState({player}));
        this.subscribe(gameStore.opSelectCard$, opSelectCard => this.setState({opSelectCard, isHandOpen: opSelectCard.can}));
        this.subscribe(gameStore.opSelectStack$, opSelectStack => this.setState({opSelectStack}));
    }

    render(){

        const {game, player, opSelectCard, opSelectStack, isHandOpen} = this.state;
        const round = game.round;
        const timer = game.timer || {};

        if(!round)
            return null;

        let message = null;
        let messageIsActive = false;

        switch(game.step){
        case Actions.STEP_CHOOSE_WHITES:
            messageIsActive = opSelectCard.can;
            message = opSelectCard.can
                ? "Choose your cards"
                : "Waiting for other players...";
            break;

        case Actions.STEP_JUDGE_STACKS:
            messageIsActive = opSelectStack.can;
            message = opSelectStack.can
                ? "Select the winning cards"
                : "Waiting for the czar...";
            break;

        case Actions.STEP_WAIT:
            message =  `${TIMER_REASONS[timer.type]}, ${TIMER_REASONS[timer.reason]}`;
            break;
        }

        const ourStackId =
            game.step === Actions.STEP_CHOOSE_WHITES
            && player
            && player.stack
            && player.stack.id;

        const stacks = ourStackId
            ? round.stacks.map(s => s.id === ourStackId ? player.stack : s)
            : round.stacks;

        return (
            <section className="c-game-board">
                <div className="black-card">
                    <Card type="black" card={round.blackCard}/>
                    <div className={`game status ${messageIsActive ? "is-active" : ""}`}>
                        {message}
                    </div>
                </div>
                <Stacks
                    stacks={stacks}
                    ourStackId={ourStackId}
                    opSelectStack={opSelectStack}
                    selectStack={this._selectStack}
                />
                <PlayerHand
                    opSelectCard={opSelectCard}
                    selectCard={this._selectCard}
                    hand={player.hand}
                    toggle={this._toggleHand}
                    isOpen={isHandOpen}
                />

            </section>
        );
    }
}
