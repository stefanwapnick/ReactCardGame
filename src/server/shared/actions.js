export const STATUS_REQUEST = "STATUS_REQUEST";
export const STATUS_FAIL = "STATUS_FAIL";
export const STATUS_SUCCESS = "STATUS_SUCCESS";

// -----------------------------------------------
// Helper functions
// -----------------------------------------------

// Creates a new action object, with status property appended to it
export function request(action){
    return {...action, status: STATUS_REQUEST};
}

export function fail(action, error){
    return {...action, status: STATUS_FAIL, error};
}

export function success(action){
    return {...action, status: STATUS_SUCCESS};
}


