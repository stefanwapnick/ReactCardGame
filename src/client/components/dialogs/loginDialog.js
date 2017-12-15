import "./loginDialog.scss";

import React from "react";
import * as Actions from "../../actions";
import {ContainerBase} from "../../lib/component";

class LoginDialog extends ContainerBase{
    render(){
        return (
            <section className="c-login-dialog">
                <h1>Login</h1>
                <p>STuff and things!</p>
            </section>
        )
    }
}

export default {
    id: Actions.DIALOG_LOGIN,
    component: LoginDialog
};