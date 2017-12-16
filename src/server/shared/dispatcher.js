import _ from "lodash";
import {Observable} from 'rxjs/Observable';
import * as Actions from "./actions";

export class Dispatcher{

    constructor(){
        this._handlers = {};
        this._emitBuffer = [];
        this._inEmit = {};
    }

    on(typeOrCallbacks, callback = null, statusFilter = null){

        if(_.isObject(typeOrCallbacks)){
            const handlers = _.map(typeOrCallbacks,
                (callback, type) => this.on(type, callback, statusFilter));
            return () => handlers.forEach(unsub => unsub());
        }

        if(!_.isFunction(callback))
            throw new Error("Callback must be a function");

        const type = typeOrCallbacks;
        const handler = {callback, statusFilter};


        if(!this._handlers.hasOwnProperty(type))
            this._handlers[type] = [];

        this._handlers[type].push(callback);

        // Un-subscribe logic. Caller does subscription = dispatcher.on().
        // subscription.unsubscribe() will call this function
        return () => {
            const handlers = this._handlers[type];
            const index = handlers.indexOf(handler);
            if(index === -1)
                return;

            handlers.splice(index, 1);
        };
    }

    on$(type){
        return new Observable(observer => {
            return this.on(type, value => observer.next(value));
        });
    }

    onRequest(typeOfCallback, callback = null){
        return this.on(typeOfCallback, callback, Actions.STATUS_REQUEST);
    }

    onFail(typeOfCallback, callback = null){
        return this.on(typeOfCallback, callback, Actions.STATUS_FAIL);
    }

    onSuccess(typeOfCallback, callback = null){
        return this.on(typeOfCallback, callback, Actions.STATUS_SUCCESS);
    }

    onRequest$(typeOfCallback, callback = null){
        return this.on$(typeOfCallback, callback, Actions.STATUS_REQUEST)
            .filter(a => a.status === Actions.STATUS_REQUEST);
    }

    onFail$(typeOfCallback, callback = null){
        return this.on$(typeOfCallback, callback, Actions.STATUS_FAIL)
            .filter(a => a.status === Actions.STATUS_FAIL);
    }

    onSuccess$(typeOfCallback, callback = null){
        return this.on$(typeOfCallback, callback, Actions.STATUS_SUCCESS)
            .filter(a => a.status === Actions.STATUS_SUCCESS);
    }

    request(action){
        this.emit(Actions.request(action));
    }

    fail(action, error){
        this.emit(Actions.fail(action, error));
    }

    success(action){
        this.emit(Actions.success(action));
    }

    respond(action, validator){
        if(validator.didFail){
            this.fail(action, validator.message);
        }else{
            this.success(action);
        }

    }


    emit(action){

        if(this._inEmit){
            this._emitBuffer.push(action);
            return;
        }

        this._emitBuffer = [];
        this._inEmit = true;

        if(this._handlers.hasOwnProperty("*"))
            this._handlers["*"].forEach(h => invokeHandler(action, h));

        if(this._handlers.hasOwnProperty(action.type))
            this._handlers[action.type].forEach(h => invokeHandler(action, h));

        const buffer = this._emitBuffer;
        this._emitBuffer = [];
        this._inEmit = false;

        for(let subAction of buffer){
            this.emit(subAction);
        }
    }

}

function invokeHandler(action, {statusFilter, callback}){
    if(statusFilter && statusFilter !== action.status)
        return;

    callback(action);
}

