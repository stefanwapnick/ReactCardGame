import * as Actions from "../actions";
import {Dispatcher} from "../shared/dispatcher";

export class Client extends Dispatcher{

    get details(){
        return {
            id: this.id,
            isLoggedIn: this.isLoggedIn,
            name: this.name
        };
    }


    constructor(socket, app){
        super();
        this.id = socket.id;
        this.isLoggedIn = flase;
        this.name = null;
        this.app = app;

        this._socket = socket;
        this._onDispose = [];

        this._onDispose.push(app.addClient(this));
        this.emit(Actions.userDetailsSet(this.details));

        socket.on("action", action => super.emit(action));
        socket.on("disconnect", () => this.dispose());

        this._installHandles();
    }

    emit(action){
        this._socket.emit("action", action);
    }


    dispose(){
        this._onDispose.forEach(a => a());
        this._onDispose = [];
    }

    _installHandles() {

    }
}