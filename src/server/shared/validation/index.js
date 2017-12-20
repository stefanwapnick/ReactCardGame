export class Validator {

    get didFail(){
        return this.errors.length > 0;
    }

    get didSucceed(){
        return this.errors.length === 0;
    }

    get message(){
        return this.errors.join(" ");
    }

    constructor(){
        this.errors = [];
    }

    push(errorObj){
        if(errorObj instanceof Validator){
            errorObj.errors.forEach(e => this.errors.push(e));
        }else{
            this.errors.push(errorObj);
        }
    }

    assert(condition, error) {
        if (condition)
            return;

        this.push(error);
    }
}

Validator.fail = function(error){
    const validator = new Validator();
    validator.push(error);
    return validator;
};

Validator.succeed = function(){
    return new Validator();
};



