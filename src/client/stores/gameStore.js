import * as Actions from "../actions";
import {mapOp$} from "../../server/shared/observable";

export default class GameStore{

    constructor({dispatcher}, user){
        const isLoggedIn$ = user.details$.map(d => d.isLoggedIn);

        this.opCreateGame$ = mapOp$(
            dispatcher.on$(Actions.GAME_CREATE),
            isLoggedIn$
        );

        this.opJoinGame$ = mapOp$(Actions.GAME_JOIN);

    }

}