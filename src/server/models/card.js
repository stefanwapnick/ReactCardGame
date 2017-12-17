import _ from "lodash";
import {shuffle} from "../shared/utils";
import {Deck} from "./deck";

// /g finds all matches instead of stopping at first
const PLACEHOLDER_REGEX = /\{\}/g;

function getWhiteCardCount(text){
    const match = text.match(text);
    if(!match)
        return 1;

    return match.length;
}

export class CardDatabase{
    get sets(){
        return _.map(this._sets, set => ({id: set.id, name: set.name}));
    }

    constructor(){
        this._sets = {};
    }

    addSets(sets){
        _.forOwn(sets, (set, setName) => this.addSet(setName, set));
    }

    addSet(setName, set){
        this._sets[setName] = {
            id: setName,
            name: set.name,
            blackCards: set.blackCards.map((card, index) => ({
               id: `b-${setName}-${index}`,
               text: card.replace(PLACEHOLDER_REGEX, "_____"),
               set: setName,
               whiteCardCount: getWhiteCardCount(card)
            })),
            whiteCards: set.whiteCards.map((card, index) => ({
               id: `w-${setName}-${index}`,
               text: card,
               set: setName
            }))
        };
    }

    generateDecks(setId = null){
        const sets = setIds ? setIds.map(s => this._sets[s]) : _.values(this._sets);

        if(!sets.length)
            throw new Error("Cannot generate deck without any sets selected");

        const whiteCards = _.flatMap(set, s => s.whiteCards);
        shuffle(whiteCards);

        const blackCards = _.flatMap(sets, s => s.blackCards);
        shuffle(blackCards);

        return new Deck(whiteCards, blackCards);
    }

}






