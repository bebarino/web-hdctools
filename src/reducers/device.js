import {
  USB_DEVICE_ADDED,
  USB_DEVICE_REMOVED,
  USB_DEVICES_PROBED,
} from '../actions/device.js';

const INITIAL_STATE = {
  devices: [],
};

export const usbReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USB_DEVICE_ADDED:
      return {
        ...state,
        devices: [...state.devices, action.device],
      };
    case USB_DEVICE_REMOVED:
      return {
        ...state,
        devices: state.devices.filter(device => device !== action.device),
      };
    case USB_DEVICES_PROBED:
      return {
        ...state,
        devices: [...action.devices],
      };
    default:
      return state;
  }
};
