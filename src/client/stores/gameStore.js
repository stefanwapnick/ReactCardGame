import * as Actions from "../actions";
import _ from "lodash";
import {mapOp$} from "../../server/shared/observable";
import {Observable, BehaviorSubject} from "rxjs";

const defaultView = {
    id: 42,
    title: "Stefan's Game",
    step: Actions.STEP_CHOOSE_WHITES,
    options: {
        scoreLimit: 5,
        sets: ["1ed"]
    },
    players: [
        {id: 1, name: "Stefan", score: 3, isCzar: false, isPlaying: true, isWinner: false},
        {id: 2, name: "Johnny", score: 1, isCzar: false, isPlaying: false, isWinner: false},
        {id: 3, name: "Jacob", score: 4, isCzar: true, isPlaying: false, isWinner: false},
        {id: 4, name: "Sally", score: 2, isCzar: false, isPlaying: false, isWinner: false},
    ],
    messages: [
        {name: "Stefan", message: "Stuff", index: 1},
        {name: "Stefan", message: "Stuff", index: 2},
        {name: "Stefan", message: "Stuff", index: 3},
    ],
    round: {
        blackCard: {
            id: 1,
            text: "Does something do something?",
            set: "1ed",
            whiteCardCount: 3
        },
        stacks: [
            {id: 1, cards: [{id: 1, text: "Hey there", set: "whoa"}]},
            {id: 2, cards: [{id: 2, text: "Hey there", set: "whoa"}]},
            {id: 3, cards: [{id: 3, text: "Hey there", set: "whoa"}]},
        ]
    },
    timer: null
};

const defaultPlayerState = {
    id: 1,
    hand: [
        {id: 1, text: "Card 1", set: "1ed"},
        {id: 2, text: "Card 2", set: "1ed"},
        {id: 3, text: "Card 3", set: "1ed"},
        {id: 4, text: "Card 4", set: "1ed"},
        {id: 5, text: "Card 5", set: "1ed"},
        {id: 7, text: "Card 7", set: "1ed"},
        {id: 8, text: "Card 8", set: "1ed"},
        {id: 9, text: "Card 9", set: "1ed"},
        {id: 10, text: "Card 10", set: "1ed"},
    ],
    stack: {
        id: 2,
        cards: [
            {id: 6, text: "Card 6", set: "1ed"},
        ]
    }
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