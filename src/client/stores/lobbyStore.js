import * as Actions from "../actions";
import {Observable} from "rxjs";
import {Validator} from "../../server/shared/validation/index";
import {validateMessage} from "../../server/shared/validation/chatValidator";
import {mapOp$} from "../../server/shared/observable";

const defaultView = {
    messages:[
        {index: 1, name: "Person", message: "Message1"},
        {index: 2, name: "Person", message: "Message2"},
        {index: 3, name: "Person", message: "Message3"},
        {index: 4, name: "Person", message: "Message4"},
        {index: 5, name: "Person", message: "Message5"}
    ],
    games: [
        {title: "Game1", id: 1, players: ["one, two, three"]},
        {title: "Game2", id: 2, players: ["one, two, three"]},
        {title: "Game3", id: 3, players: ["one, two, three"]},
        {title: "Game4", id: 4, players: ["one, two, three"]},
        {title: "Game5", id: 5, players: ["one, two, three"]}
    ]
};

export default class LobbyStore{

    constructor({dispatcher}, userStore){
        this.view$ = Observable.of(defaultView);

        dispatcher.onRequest({
            [Actions.LOBBY_JOIN]: action => dispatcher.success(action),
            [Actions.LOBBY_SEND_MESSAGE]: action => {
                const validator = new Validator();
                if(!userStore.isLoggedIn){
                    validator.push("You must be logged in");
                }

                validator.push(validateMessage(action.message));

                if(validator.didFail){
                    dispatcher.fail(action, validator.message);
                    return;
                }

                // TODO: Send on socket io
            }
        });

        this.opSendMessage$ = mapOp$(
            dispatcher.on$(Actions.LOBBY_SEND_MESSAGE),
            userStore.details$.map(u => u.isLoggedIn)
        );

    }


}