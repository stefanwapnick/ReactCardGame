import * as Actions from "../actions";
import _ from "lodash";

export default class AppStore{

    constructor(services){
        // Object deconstruction to get services
        const {dispatcher} = services;

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
    }

}