import * as Actions from "../actions";
import {Observable, BehaviorSubject} from "rxjs";
import _ from "lodash";
import {createView$} from "../lib/stores";

const defaultView = {
    sets: []
};

// const defaultView = {
//     sets: [
//         {id: "1ed", name: "1st Edition"},
//         {id: "2ed", name: "2nd Edition"},
//         {id: "3ed", name: "3rd Edition"},
//         {id: "4ed", name: "4th Edition"},
//     ]
// };

export default class AppStore{

    constructor(services){
        // Object deconstruction to get services
        const {dispatcher, socket} = services;

        this.view$ = createView$(dispatcher, Actions.VIEW_APP, defaultView);

        this.dialogs$ = dispatcher
            .on$(Actions.DIALOG_SET)
            .scan((stack, newAction) => {

                // Remove action in stack with same id if it already exists
                _.remove(stack, {id: newAction.id});

                if(newAction.isOpen)
                    stack.push({id: newAction.id, props: newAction.props});

                return stack;
            }, [])
            // Start with replay series with [] for publishReplay(1)
            .startWith([])
            // Whoever subscribes will immediately get last published value
            .publishReplay(1);

        // Connect observable since this is a connectable observable
        this.dialogs$.connect();

        socket.on("connect", () => dispatcher.emit(Actions.appConnectionSet(Actions.CONNECTION_CONNECTED)));
        socket.on("reconnecting", () => dispatcher.emit(Actions.appConnectionSet(Actions.APP_CONNECTION_RECONNECTED)));
        socket.on("disconnect", () => dispatcher.emit(Actions.appConnectionSet(Actions.CONNECTION_DISCONNECTED)));
        socket.on("reconnect", () => dispatcher.emit(Actions.appConnectionSet(Actions.appConnectionReconnected())));

        this.connection$ = dispatcher
            .on$(Actions.APP_CONNECTION_SET)
            .startWith(socket.connected ? Actions.CONNECTION_CONNECTED : Actions.CONNECTION_DISCONNECTED)
            .publishReplay(1);

        this.connection$.connect();
        this.reconnected$ = dispatcher.on$(Actions.APP_CONNECTION_RECONNECTED).publish();
        this.reconnected$.connect();
    }
}