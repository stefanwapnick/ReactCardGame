import "./controls.scss";

import React from "react";

export default class TextInput extends React.Component{

    get value(){
        return this.input.value;
    }

    set value(value){
        this.input.value = value;
    }

    render(){
        const props = this.props;
        return (
            <div className={`m-textbox ${props.className || ""}`}>
                <input type="text" {...props} ref={c => this.input = c}></input>
                <div className="border"></div>
            </div>
        );
    }
}