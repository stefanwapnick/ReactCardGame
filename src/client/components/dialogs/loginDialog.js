import "./loginDialog.scss";

import React from "react";
import * as Actions from "../../actions";
import {ContainerBase} from "../../lib/component";
import {TextInput} from "../controls";

class LoginDialog extends ContainerBase{

    constructor(props){
        super(props);
        this._close = (event) => {
            event.preventDefault();
            this.dispatch(Actions.dialogSet(Actions.DIALOG_LOGIN, false));
        };

        this._login = (event) => {
            event.preventDefault();
            this.request(Actions.userLogin(this._username.value));
        };

        // this.state = {
        //     opLogin: {can: true, inProgress: false}
        // };
    }

    componentWillMount(){
        const {stores: {userStore}} = this.context;

        this.subscribe(userStore.opLogin$, opLogin => this.setState({opLogin}));

        // If logged in, close this dialog
        this.subscribe(userStore.details$, details => {
            if(details.isLoggedIn){
                this.dispatch(Actions.dialogSet(Actions.DIALOG_LOGIN, false));
            }
        });
    }

    componentDidMount(){
        this._username.input.focus();
    }

    render(){

        const {opLogin} = this.state;
        const disabled = opLogin.inProgress;

        return (
            <section className="c-login-dialog">
                <h1>Login</h1>
                <form onSubmit={this._login} disabled={disabled}>
                    <div className="form-row">
                        <TextInput
                            placeholder="username"
                            ref={c => this._username = c}
                            disabled={disabled || !opLogin.can}/>
                    </div>

                    {!opLogin.error ? null :
                        <p className="error">{opLogin.error}</p> }

                    <div className="submit-row">
                        <button className="m-button good" disabled={disabled || !opLogin.can}>Login</button>
                        <button className="m-button close-button" onClick={this._close}>Close</button>
                    </div>

                </form>
            </section>
        )
    }
}

export default {
    id: Actions.DIALOG_LOGIN,
    component: LoginDialog
};