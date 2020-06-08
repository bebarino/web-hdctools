import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose as reduxCompose,
} from 'redux';

/* This is ripped straight from redux-thunk because modules and imports confuse me */
function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    const dispatch = _ref.dispatch,
      getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

const thunk = createThunkMiddleware();

import { lazyReducerEnhancer } from 'pwa-helpers';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose;

export const store = createStore(
  state => state,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);
