import * as Actions from "../actions";
import {Dispatcher} from "../shared/dispatcher";
import {validateName} from "shared/validation/userValidator";
import LobbyHandlers from "./handlers/lobbyHandler";
import GameHandlers from "./handlers/gameHandler";

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
        this.handlers = null;

        this._onDispose.push(app.addClient(this));
        this.emit(Actions.userDetailsSet(this.details));

        socket.on("action", action => super.emit(action));
        socket.on("disconnect", () => this.dispose());

        this._installHandles();
    }

    emit(action){
        this._socket.emit("action", action);
    }

    login(name){
        const validator = validateName(name);
        if(validator.didFail)
            return validator;

        this.isLoggedIn = true;
        this.name = name;
        this.emit(Actions.userDetailsSet(this.details));

        if(this.handlers)
            this.handlers.onLogin();

        return validator;
    }

    setHandlers(handlers){
        if(this.handlers){
            this.handlers.dispose();
        }

        this.handlers = handler;
    }

    dispose(){
        this._onDispose.forEach(a => a());
        this._onDispose = [];

        if(this.handlers){
            this.handlers.dispose();
            this.handlers = null;
        }
    }

    _installHandles() {
        const {lobby} = this.app;

        this.onRequest({
            [Actions.USER_LOGIN]: (action) => {
                // For now, server just validates name of user
                const validator = this.login(action.name);
                this.respond(action, validator);
            },

            [Actions.LOBBY_JOIN]: (action) => {
                if (this.handlers instanceof LobbyHandlers) {
                    this.succeed(action);
                    return;
                }

                this.setHandlers(new LobbyHandlers(this, lobby));
                this.succeed(action);
            },

            [Actions.GAME_CREATE]: (action) => {
                if (!this.isLoggedIn) {
                    this.fail(action, "You must be logged in");
                    return;
                }

                let game;
                try {
                    game = lobby.createGame(`${this.name}'s game`);
                    this.setHandlers(new GameHandlers(this, game));
                    this.succeed(action);
                    this.succeed(A.gameJoin(game.id));
                } catch (e) {
                    if (game)
                        game.dispose();

                    this.fail(action);
                    throw e;
                }
            },

            [Actions.GAME_JOIN]: (action) => {
                if (this.handlers instanceof GameHandlers && this.handlers.game.id === action.gameId) {
                    this.succeed(action);
                    return;
                }

                const game = lobby.getGameById(action.gameId);
                if (!game) {
                    this.fail(action, "Invalid game");
                    return;
                }

                this.setHandlers(new GameHandlers(this, game));
                this.succeed(action);
            }
        })
    }
}