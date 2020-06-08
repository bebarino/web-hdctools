import {
  USB_DEVICE_ADDED,
  USB_DEVICE_REMOVED,
  USB_DEVICES_PROBED
} from "../actions/device.js";

const INITIAL_STATE = {
  devices: []
};

export const usbReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USB_DEVICE_ADDED:
      const added = action.device;
      return {
        ...state,
        devices: [...state.devices, added]
      };
    case USB_DEVICE_REMOVED:
      const removed = action.device;
      return {
        ...state,
        devices: state.devices.filter(device => device !== removed)
      };
    case USB_DEVICES_PROBED:
      return {
        ...state,
        devices: [...action.devices]
      };
    default:
      return state;
  }
};
