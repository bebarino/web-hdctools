import {
  FLASHROM_CHIP_FOUND,
  FLASHROM_CHIP_READ,
  FLASHROM_CHIP_READ_FINISHED,
  FLASHROM_CHIP_WRITE,
  FLASHROM_CHIP_WRITE_FINISHED
} from "../actions/flashrom.js";

const INITIAL_STATE = {
  reading: false,
  writing: false,
  size: -1,
  flashName: ""
};

export const flashrom = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FLASHROM_CHIP_FOUND:
      return {
        ...state,
        size: action.size,
        flashName: action.flashName
      };
    case FLASHROM_CHIP_READ:
      return {
        ...state,
        reading: true
      };
    case FLASHROM_CHIP_READ_FINISHED:
      return {
        ...state,
        reading: false
      };
    case FLASHROM_CHIP_WRITE:
      return {
        ...state,
        writing: true
      };
    case FLASHROM_CHIP_WRITE_FINISHED:
      return {
        ...state,
        writing: false
      };
    default:
      return state;
  }
};
