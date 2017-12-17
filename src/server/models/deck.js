import {shuffle} from "../shared/utils";

export class Deck{
    constructor(whiteCards, blackCards){
        this._whiteDeck = whiteCards;
        this._blackDeck = blackCards;

        this._whiteDiscard = [];
        this._blackIndex = 0;
    }

    drawWhiteCard(count){
        if(count >= this._whiteDeck.length){
            if(count >= this._whiteDeck.length + this._whiteDiscard.length){
                throw new Error(`Cannot draw ${count} cards, since there aren't enough left!`);
            }

            this._whiteDeck.push(...this._whiteDiscard);
            this._whiteDiscard = [];
            shuffle(this._whiteDeck);
        }

        // Extract count elements from white deck
        return this._whiteDeck.splice(0, count);
    }

    drawBlackCard(){
        // Restart to recycle cards if index > number of cards in deck
        if(this._blackIndex >= this._blackDeck.length){
            shuffle(this._blackDeck);
            this._blackIndex = 0;
        }

        return this._blackDeck[this._blackIndex++];
    }

    discardWhiteCards(cards){
        this._whiteDiscard.push(...cards);
    }

}