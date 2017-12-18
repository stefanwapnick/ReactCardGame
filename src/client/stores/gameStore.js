import * as Actions from "../actions";
import _ from "lodash";
import {mapOp$} from "../../server/shared/observable";
import {Observable} from "rxjs";
import {createView$} from "../lib/stores";

// const defaultView = {
//     id: 42,
//     title: "Stefan's Game",
//     step: Actions.STEP_SETUP,
//     options: {
//         scoreLimit: 5,
//         sets: ["1ed"]
//     },
//     players: [
//         {id: 1, name: "Stefan", score: 3, isCzar: false, isPlaying: true, isWinner: false},
//         {id: 2, name: "Johnny", score: 1, isCzar: false, isPlaying: false, isWinner: false},
//         {id: 3, name: "Jacob", score: 4, isCzar: true, isPlaying: false, isWinner: false},
//         {id: 4, name: "Sally", score: 2, isCzar: false, isPlaying: false, isWinner: false},
//     ],
//     messages: [
//         {name: "Stefan", message: "Stuff", index: 1},
//         {name: "Stefan", message: "Stuff", index: 2},
//         {name: "Stefan", message: "Stuff", index: 3},
//     ],
//     round: {
//         blackCard: {
//             id: 1,
//             text: "Does something do something?",
//             set: "1ed",
//             whiteCardCount: 3
//         },
//         stacks: [
//             {id: 1, cards: [{id: 1, text: "Hey there", set: "whoa"}]},
//             {id: 2, cards: [{id: 2, text: "Hey there", set: "whoa"}]},
//             {id: 3, cards: [{id: 3, text: "Hey there", set: "whoa"}]},
//         ]
//     },
//     timer: null
// };

const defaultView = {
    id: null,
    title: null,
    step: Actions.STEP_DISPOSED,
    options: {},
    players: [],
    messages: [],
    round: null,
    timer: null
};

const defaultPlayerState = {
    id: null,
    hand: [],
    stack: null
};

export default class GameStore{

    constructor({dispatcher, socket}, userStory){
        const isLoggedIn$ = userStory.details$.map(d => d.isLoggedIn);
        const passThroughAction = action => socket.emit("action", action);

        dispatcher.onRequest({
            [Actions.GAME_CREATE]: passThroughAction,
            [Actions.GAME_JOIN]: passThroughAction,
            [Actions.GAME_SET_OPTIONS]: passThroughAction,
            [Actions.GAME_START]: passThroughAction,
            [Actions.GAME_SELECT_CARD]: passThroughAction,
            [Actions.GAME_SELECT_STACK]: passThroughAction
        });

        this.opCreateGame$ = mapOp$(
            dispatcher.on$(Actions.GAME_CREATE),
            isLoggedIn$
        );

        this.opJoinGame$ = mapOp$(
            dispatcher.on$(Actions.GAME_JOIN)
        );

        this.view$ = createView$(dispatcher, Actions.VIEW_GAME, defaultView);
        this.player$ = createView$(dispatcher, Actions.VIEW_PLAYER, defaultPlayerState);

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