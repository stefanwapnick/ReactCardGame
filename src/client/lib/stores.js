import {Observable} from "rxjs";
import * as Actions from "../actions";
import {mergeDiff} from "shared/diff";

export function createView$(dispatcher, viewType, defaultView) {
    const mergeView$ = dispatcher
        .on$(Actions.MERGE_VIEW)
        .filter(a => a.view === viewType)
        .map(function(action) {
            return function(view) {
                return mergeDiff(view, action.diff);
            };
        });

    const reconnect$ = dispatcher
        .on$(Actions.APP_CONNECTION_RECONNECTED)
        .map(() => () => defaultView);

    const view$ = Observable.merge(mergeView$, reconnect$)
        .scan((view, op) => op(view), {})
        .startWith(defaultView)
        .publishReplay(1);

    view$.connect();
    return view$;
}