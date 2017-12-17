import * as Actions from "../actions";
import _ from "lodash";
import {mapOp$} from "../../server/shared/observable";
import {Observable, BehaviorSubject} from "rxjs";

const defaultView = {
    id: 42,
    title: "Stefan's Game",
    step: Actions.STEP_SETUP,
    options: {
        scoreLimit: 5,
        sets: ["1ed"]
    },
    players: [
        {id: 1, name: "Stefan", score: 3, isCzar: false, isPlaying: false, isWinner: true},
        {id: 2, name: "Johnny", score: 1, isCzar: false, isPlaying: true, isWinner: false},
        {id: 3, name: "Jacob", score: 4, isCzar: true, isPlaying: false, isWinner: false},
        {id: 4, name: "Sally", score: 2, isCzar: false, isPlaying: false, isWinner: false},
    ],
    messages: [
        {name: "Stefan", messages: "Stuff"},
        {name: "Stefan", messages: "Stuff"},
        {name: "Stefan", messages: "Stuff"},
    ],
    round: null,
    timer: null
};

const defaultPlayerState = {
    id: 1,
    hand: [],
    stack: null
};

export default class GameStore{

    constructor({dispatcher}, userStory){
        const isLoggedIn$ = userStory.details$.map(d => d.isLoggedIn);



        dispatcher.onRequest({
            [Actions.GAME_CREATE]: action => {
                dispatcher.success(action);
                dispatcher.success(Actions.gameJoin(42));
            },
            [Actions.GAME_JOIN]: action => dispatcher.success(action),
            [Actions.GAME_SET_OPTIONS]: action => dispatcher.success(action),
            [Actions.GAME_START]: action => dispatcher.success(action),
            [Actions.GAME_SELECT_CARD]: action => dispatcher.success(action),
            [Actions.GAME_SELECT_STACK]: action => dispatcher.success(action),
        });

        this.opCreateGame$ = mapOp$(
            dispatcher.on$(Actions.GAME_CREATE),
            isLoggedIn$
        );

        this.opJoinGame$ = mapOp$(
            dispatcher.on$(Actions.GAME_JOIN)
        );

        this.view$ = new BehaviorSubject(defaultView);
        this.player$ = new BehaviorSubject(defaultPlayerState);

        this.opSetOptions$ = mapOp$(
            dispatcher.on$(Actions.GAME_SET_OPTIONS),
            isLoggedIn$
        );

        this.opStart$ = mapOp$(
            dispatcher.on$(Actions.GAME_START),
            isLoggedIn$
        );

        // Make new observable that will emit whenever either of the view state of player state changes
        const playerAndGame$ = Observable.combineLatest(this.view$, this.player$);

        this.opSelectCard$ = mapOp$(
            dispatcher.on$(Actions.GAME_SELECT_CARD),
            playerAndGame$.map(([game, player]) => {
                const ourPlayer = _.find(game.players, {id: player.id});
                return ourPlayer && game.step === Actions.STEP_CHOOSE_WHITES && ourPlayer.isPlaying;
            })
        );

        this.opSelectStack$ = mapOp$(
            dispatcher.on$(Actions.GAME_SELECT_STACK),
            playerAndGame$.map(([game, player]) => {
                const ourPlayer = _.find(game.players, {id: player.id});
                return ourPlayer && game.step === Actions.STEP_JUDGE_STACKS && ourPlayer.isCzar;
            })
        );

        this.opSendMessage$ = mapOp$(
            dispatcher.on$(Actions.GAME_SEND_MESSAGE),
            isLoggedIn$
        );

    }

}