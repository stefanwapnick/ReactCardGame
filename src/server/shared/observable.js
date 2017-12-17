import {Observable} from "rxjs";
import * as Actions from "./actions";

// Operation to execute observable and can execute observable (similar to RelayAction in WPF MVVM)
// Utility method that maps an operation observable and a can$ observable to a new observable
// in the form  {can: can, isProgress: bool, failed: bool};
export function mapOp$(op$, can$ = Observable.of(true)){
    const operation$ = op$
        .startWith({})
        .combineLatest(can$)
        .map(([action, can]) => {
            if(!action.hasOwnProperty("status"))
                return {can, isProgress: false, failed: false};

            if(action.status === Actions.STATUS_REQUEST)
                return {can, isProgress: true, failed: false};

            if(action.status === Actions.STATUS_FAIL)
                return {can, isProgress: false, failed: true, error: action.error};

            return {can, inProgress: false, failed: false};
        })
        .publishReplay(1);

    operation$.connect();
    return operation$;
}