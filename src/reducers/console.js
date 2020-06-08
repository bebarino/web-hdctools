import {
  CONSOLE_OPENED,
  CONSOLE_INTERFACES_FOUND,
} from '../actions/console.js';

const INITIAL_STATE = {};

export const consoles = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CONSOLE_OPENED:
      return {
        ...state,
        endpoint: action.endpoint,
        intf: action.interface,
      };
    case CONSOLE_INTERFACES_FOUND:
      return {
        ...state,
        items: [...action.items],
      };
    default:
      return state;
  }
};
