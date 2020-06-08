const createStore = Redux.createStore;
const combineReducers = Redux.combineReducers;
const applyMiddleware = Redux.applyMiddleware;

/* This is ripped straight from redux-thunk because modules and imports confuse me */
function createThunkMiddleware(extraArgument) {
  return function(_ref) {
    var dispatch = _ref.dispatch,
      getState = _ref.getState;
    return function(next) {
      return function(action) {
        if (typeof action === "function") {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();

import { lazyReducerEnhancer } from "https://unpkg.com/pwa-helpers@latest/lazy-reducer-enhancer.js?module";

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

export const store = createStore(
  (state, action) => state,
  compose(
    lazyReducerEnhancer(combineReducers),
    applyMiddleware(thunk)
  )
);
