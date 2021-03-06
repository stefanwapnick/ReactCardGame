import React, {Children, PropTypes} from "react";

export class StoreProvider extends React.Component {

    render(){
        return Children.only(this.props.children);
    }

    getChildContext(){
        const {stores, services} = this.props;
        return {stores, services};
    }
}

StoreProvider.propTypes = {
    stores: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired
};

StoreProvider.childContextTypes = {
    stores: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired
};


/**
    Utility base class for managing rxjs observable subscriptions and un-subscribing actions
 **/
export class ContainerBase extends React.Component{
    constructor(props){
        super(props);
        this._subscriptions = [];
    }

    subscribe(observable$, callback){
        const subscription = observable$.subscribe(callback);
        this._subscriptions.push(subscription);
    }

    componentWillUnmount(){
        this._subscriptions.forEach(s => s.unsubscribe());
        this._subscriptions = [];
    }

    dispatch(action){
        this.context.services.dispatcher.emit(action);
    }

    request(action){
        this.context.services.dispatcher.request(action);
    }

}

ContainerBase.contextTypes = {
    stores: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired
};



