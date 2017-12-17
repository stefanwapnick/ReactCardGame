import {ContainerBase} from "../../lib/component";
import React from "react";
import * as Actions from "../../actions";
import _ from "lodash";

export default class GameSetup extends ContainerBase {

    constructor(props){
        super(props);

        this._setscoreLimit = (e) => {
            if(!this.state.opSetOptions.can){
                return;
            }

            this.request(Actions.gameSetOptions(this.state.game.id, {
                ...this.state.game.options,
                scoreLimit: parseInt(e.target.value)
            }));
        };

        this._toggleSet = (set) => {

            const {opSetOptions, game: {options}} = this.state;

            if(!opSetOptions.can)
                return;

            const newSets = set.isSelected
                ? options.sets.filter(setId => setId !== set.id)
                : options.sets.concat(set.id);

            this.request(Actions.gameSetOptions(this.state.game.id, {
                options,
                sets: newSets
            }));

            this._startGame = (e) => {
                e.preventDefault();

                const {opStart, game: {id}} = this.state;
                if(!opStart.can)
                    return;

                this.request(Actions.gameStart(id));
            };
        };
    }

    componentWillMount(){
        const {stores: {appStore, gameStore}} = this.context;

        this.subscribe(appStore.view$.map(v => v.sets), sets => this.setState({sets}));
        this.subscribe(gameStore.view$, game => this.setState({game}));
        this.subscribe(gameStore.opSetOptions$, opSetOptions => this.setState({opSetOptions}));
        this.subscribe(gameStore.opSetOptions$, opStart => this.setState({opStart}));
    }

    render(){
        const {sets, game: {options}, opSetOptions, opStart} = this.state;

        const setList = sets.map(set => ({
            id: set.id,
            name: set.name,
            isSelected: options.sets.includes(set.id)
        }));

        const disabled = !opSetOptions.can || opSetOptions.inProgress || opStart.inProgress;
        const error = opStart.error || opSetOptions.error;

        return (
            <section className={`c-game-setup ${disabled ? "disabled" : "enabled"}`}>
                <h1>
                    Game Options
                    {!error ? null :
                        <span className="error">{error}</span>}
                </h1>
                <form className="body">
                    <div className="form-row">
                        <label>Score Limit:</label>
                        <select value={options.scoreLimit} onChange={this._setscoreLimit} disabled={disabled}>
                            {_.range(4,50).map(i =>
                                <option value={i} key={i}>{i}</option>)}
                        </select>
                    </div>
                    <div className="form-row">
                        <label>Sets:</label>
                        <SetList sets={setList} toggleSet={this._toggleSet}/>
                    </div>
                    <button className="m-button start-game good" onClick={this._startGame} disabled={disabled}>
                    </button>
                </form>
            </section>
        );
    }
}

function SetList({sets, toggleSet}){
    return (
        <ul className="sets-list">
            {sets.map(set =>
                <li key={set.id} className={set.isSelected ? "is-selected" : null} onClick={() => toggleSet(set)}>
                    {set.name}
                </li>)}
        </ul>
    );
}

