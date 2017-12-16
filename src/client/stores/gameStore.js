import * as Actions from "../actions";
import {mapOp$} from "../../server/shared/observable";

export default class GameStore{

    constructor({dispatcher}, userStory){
        const isLoggedIn$ = userStory.details$.map(d => d.isLoggedIn);

        this.opCreateGame$ = mapOp$(
            dispatcher.on$(Actions.GAME_CREATE),
            isLoggedIn$
        );

        this.opJoinGame$ = mapOp$(
            dispatcher.on$(Actions.GAME_JOIN)
        );

    }

}