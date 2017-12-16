import {Validator} from "./index";

export const MESSAGE_LENGTH_LIMIT = 50;
export function validateMessage(message){
    if(message.length > MESSAGE_LENGTH_LIMIT)
        return Validator.fail(`Message must be less than or equal to ${MESSAGE_LENGTH_LIMIT} characters`);

    return Validator.succeed();
}