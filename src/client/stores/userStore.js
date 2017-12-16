import {BehaviorSubject} from "rxjs";
import * as Actions from "../actions";
import {mapOp$} from "../../server/shared/observable";
import {validateName} from "../../server/shared/validation/userValidator";

const defaultDetails = {
    isLoggedIn: false,
    id: null,
    name: null
};

export default class UserStore{

    constructor({dispatcher}){

        // Make new subject that can be subscribed to
        // Set default value for first observable events
        this.details$ = new BehaviorSubject(defaultDetails);

        // Copy properties from details object to properties on this class
        this.details$.subscribe(details => Object.keys(details).forEach(k => this[k] = details[k]));

        // The extract [] around Actions.USER_LOGIN tells Javascript to extract the string value to use as the key of the object
        dispatcher.onRequest({
            [Actions.USER_LOGIN] : (action) => {
                const validator = validateName(action.name);

                if(validator.didFail){
                    dispatcher.fail(action, validator.message);
                    return;
                }

                dispatcher.succeed(action);
                this.details$.next({
                    isLoggedIn: true,
                    id: 4432,
                    name: action.name
                });

            }
        });

        this.opLogin$ = mapOp$(
            dispatcher.on$(Actions.USER_LOGIN),
            this.details$.map(details => !details.isLoggedIn)
        );

    }

}