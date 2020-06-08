import {
  UPDATE_TITLE,
  UPDATE_PAGE,
  UPDATE_DRAWER_STATE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  NAVIGATED_LOCATION,
} from '../actions/app.js';

const INITIAL_STATE = {
  title: 'hdctools in JavaScript!!',
  page: 'home',
};

export const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_TITLE:
      return {
        ...state,
        title: action.title,
      };
    case UPDATE_PAGE:
      return {
        ...state,
        prevpage: state.page,
        page: action.page,
      };
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened,
      };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true,
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false,
      };
    case NAVIGATED_LOCATION:
      return {
        ...state,
        location: action.location,
      };
    default:
      return state;
  }
};
