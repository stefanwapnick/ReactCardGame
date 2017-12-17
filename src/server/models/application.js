import * as Actions from "../actions";
import {Dispatcher} from "../shared/dispatcher";
import {RoomBase} from "../lib/room";

export class Application extends RoomBase{

    get view(){
        return {
            sets: this.cards.sets
        }
    }

    constructor(cards){
        super(Actions.VIEW_APP);
        this.dispatcher = new Dispatcher();
        this.cards = cards;
        // TODO: Make lobby
    }

}

